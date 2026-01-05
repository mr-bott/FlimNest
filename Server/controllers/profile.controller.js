const User = require("../models/user.model");       // your User model
const UserMedia = require("../models/userMedia.model");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get user basic details
    const user = await User.findById(userId).select(
      "name email createdAt"
    );

    // 2️⃣ Get media data
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

        // count genres
        item.genres.forEach(genreId => {
          genreMap[genreId] = (genreMap[genreId] || 0) + 1;
        });
      });
    }

    // 3️⃣ Sort top genres
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genreId, count]) => ({ genreId, count }));

    res.json({
      user: {
        name: user.name,
        email: user.email,
        joinedAt: user.createdAt
      },
      stats: {
        watchedCount,
        watchlistCount,
        likedCount
      },
      topGenres
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
