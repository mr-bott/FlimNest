const WatchedMovie = require("../models/recentlyViewed.model");
const redisClient = require("../rateLimiter/redisClient");

// add a movie to watched list
exports.addWatchedMovie = async (req, res) => {
  const { tmdbId, mediaType, title, posterPath, rating, genres } = req.body;
  const userId = req.user.id;
  const cacheKey = `watched:user:${userId}`;

  try {
    let record = await WatchedMovie.findOne({ user: userId });

    if (record) {
      const alreadyWatched = record.watchedMovies.find(
        movie => movie.tmdbId === tmdbId && movie.mediaType === mediaType
      );

      if (alreadyWatched) {
        return res.status(200).json({
          message: "Movie already exists in watched list",
        });
      }

      record.watchedMovies.push({
        tmdbId,
        mediaType,
        title,
        posterPath,
        rating,
        genres,
        watchedAt: new Date(),
      });

      await record.save();
    } else {
      record = await WatchedMovie.create({
        user: userId,
        watchedMovies: [
          {
            tmdbId,
            mediaType,
            title,
            posterPath,
            rating,
            genres,
            watchedAt: new Date(),
          },
        ],
      });
    }

    // WRITE-THROUGH CACHE
    await redisClient.set(
      cacheKey,
      JSON.stringify(record.watchedMovies),
      { EX: 3600 }
    );

    res.status(201).json(record.watchedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getWatchedMovies = async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `watched:user:${userId}`;

  try {
    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // DB fallback
    const data = await WatchedMovie.findOne({ user: userId });

    const watchedMovies = data?.watchedMovies || [];

    // Store in cache
    await redisClient.set(
      cacheKey,
      JSON.stringify(watchedMovies),
      { EX: 3600 }
    );

    res.json(watchedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWatchedMovie = async (req, res) => {
  const { tmdbId } = req.params;
  const userId = req.user.id;
  const cacheKey = `watched:user:${userId}`;

  try {
    const updated = await WatchedMovie.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          watchedMovies: { tmdbId: Number(tmdbId) },
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Watch history not found" });
    }

    // UPDATE CACHE AFTER DELETE
    await redisClient.set(
      cacheKey,
      JSON.stringify(updated.watchedMovies),
      { EX: 3600 }
    );

    res.json({
      message: "Movie removed from watched list",
      watchedMovies: updated.watchedMovies,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
