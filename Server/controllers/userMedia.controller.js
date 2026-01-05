const UserMedia = require("../models/userMedia.model");
const redisClient = require("../rateLimiter/redisClient");

// helper functions for cache keys
const keys = {
  all: (userId) => `media:user:${userId}`,
  status: (userId, status) => `media:user:${userId}:status:${status}`,
  movie: (userId, tmdbId) => `media:user:${userId}:movie:${tmdbId}`,
};

const invalidateAll = async (userId) => {
  await redisClient.del(keys.all(userId));
  await redisClient.del(keys.status(userId, "watched"));
  await redisClient.del(keys.status(userId, "watchlist"));
  // movie-level keys are invalidated on demand
};

// ADD / UPDATE (WRITE-THROUGH)
exports.addMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      tmdbId,
      mediaType,
      title,
      posterPath,
      genres = [],
      rating = null,
      status,
      liked = false,
    } = req.body;

    if (!tmdbId || !mediaType || !title || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const watchedAt = status === "watched" ? new Date() : null;

    let userMedia = await UserMedia.findOne({ user: userId });

    if (!userMedia) {
      userMedia = await UserMedia.create({
        user: userId,
        media: [{
          tmdbId,
          mediaType,
          title,
          posterPath,
          genres,
          rating,
          status,
          liked,
          watchedAt,
        }],
      });

      await invalidateAll(userId);
      await redisClient.del(keys.movie(userId, tmdbId));

      return res.status(201).json(userMedia);
    }

    const existing = userMedia.media.find(m => m.tmdbId === tmdbId);

    if (existing) {
      existing.status = status;
      existing.rating = rating;
      existing.liked = liked;
      existing.genres = genres;
      existing.posterPath = posterPath;
      existing.watchedAt = watchedAt;

      await userMedia.save();

      await invalidateAll(userId);
      await redisClient.del(keys.movie(userId, tmdbId));

      return res.json({ message: "Media updated", media: existing });
    }

    userMedia.media.push({
      tmdbId,
      mediaType,
      title,
      posterPath,
      genres,
      rating,
      status,
      liked,
      watchedAt,
    });

    await userMedia.save();

    await invalidateAll(userId);
    await redisClient.del(keys.movie(userId, tmdbId));

    res.status(201).json({
      message: "Media added",
      media: userMedia.media[userMedia.media.length - 1],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL (CACHE-ASIDE) 
exports.getAllMedia = async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = keys.all(userId);

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const userMedia = await UserMedia.findOne({ user: userId });
    const media = userMedia?.media || [];

    await redisClient.set(cacheKey, JSON.stringify(media), { EX: 600 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MOVIE STATUS (CACHE-ASIDE)
exports.getMovieStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId } = req.params;
    const cacheKey = keys.movie(userId, tmdbId);

    const cached = await redisClient.get(cacheKey);
    if (cached){
       return res.json(JSON.parse(cached));

    }
    const userMedia = await UserMedia.findOne({ user: userId });
    if (!userMedia) {
      const empty = { status: null, liked: false };
      await redisClient.set(cacheKey, JSON.stringify(empty), { EX: 300 });
      return res.json(empty);
    }

    const mediaItem = userMedia.media.find(
      item => item.tmdbId === Number(tmdbId)
    );

    const result = mediaItem
      ? {
          status: mediaItem.status,
          liked: mediaItem.liked,
          rating: mediaItem.rating,
          watchedAt: mediaItem.watchedAt,
        }
      : { status: null, liked: false };

    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY STATUS (CACHE-ASIDE)
exports.getByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.params;
    const cacheKey = keys.status(userId, status);

    const cached = await redisClient.get(cacheKey);
    if (cached){
       return res.json(JSON.parse(cached));
    }
    const userMedia = await UserMedia.findOne({ user: userId });
    const filtered = userMedia?.media.filter(m => m.status === status) || [];

    await redisClient.set(cacheKey, JSON.stringify(filtered), { EX: 600 });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE MEDIA (WRITE-THROUGH)
exports.updateMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId } = req.params;
    const updates = req.body;

    if (updates.status === "watched") {
      updates.watchedAt = new Date();
    }

    const userMedia = await UserMedia.findOneAndUpdate(
      { user: userId, "media.tmdbId": Number(tmdbId) },
      { $set: { "media.$": { ...updates, tmdbId: Number(tmdbId) } } },
      { new: true }
    );

    await invalidateAll(userId);
    await redisClient.del(keys.movie(userId, tmdbId));

    res.json(userMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TOGGLE LIKE (WRITE-THROUGH)
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId } = req.params;

    const userMedia = await UserMedia.findOne({ user: userId });
    const mediaItem = userMedia.media.find(m => m.tmdbId === Number(tmdbId));

    mediaItem.liked = !mediaItem.liked;
    await userMedia.save();

    await invalidateAll(userId);
    await redisClient.del(keys.movie(userId, tmdbId));

    res.json(mediaItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE MEDIA (WRITE-THROUGH)
exports.deleteMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId } = req.params;

    const userMedia = await UserMedia.findOneAndUpdate(
      { user: userId },
      { $pull: { media: { tmdbId: Number(tmdbId) } } },
      { new: true }
    );

    await invalidateAll(userId);
    await redisClient.del(keys.movie(userId, tmdbId));

    res.json(userMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
