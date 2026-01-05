const User = require("../models/user.model");
const UserMedia = require("../models/userMedia.model");
const redisClient = require("../rateLimiter/redisClient");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // CHECK CACHE FIRST
    const cacheKey = `userProfile:${userId}`;
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      console.log("Serving profile from cache");
      return res.json(JSON.parse(cachedProfile));
    }

    // FETCH USER
    const user = await User.findById(userId).select(
      "name email profilePic createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // FETCH MEDIA
    const userMedia = await UserMedia.findOne({ user: userId });

    let watchedCount = 0;
    let watchlistCount = 0;
    let likedCount = 0;
    const genreMap = {};

    if (userMedia?.media?.length) {
      userMedia.media.forEach(item => {
        if (item.status === "watched") watchedCount++;
        if (item.status === "watchlist") watchlistCount++;
        if (item.liked) likedCount++;

        item.genres.forEach(genreId => {
          genreMap[genreId] = (genreMap[genreId] || 0) + 1;
        });
      });
    }

    // TOP GENRES
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genreId, count]) => ({ genreId, count }));

    const profileResponse = {
      user: {
        name: user.name,
        email: user.email,
        joinedAt: user.createdAt,
        profilePic: user.profilePic,
      },
      stats: {
        watchedCount,
        watchlistCount,
        likedCount,
      },
      topGenres,
    };

    // STORE IN REDIS
    await redisClient.set(
      cacheKey,
      JSON.stringify(profileResponse),
      { EX: 600 } // 10 minutes TTL
    );
    res.json(profileResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
