const UserMedia = require("../models/userMedia.model");

// POST /api/media
// exports.addMedia = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       tmdbId,
//       mediaType,
//       title,
//       posterPath,
//       genres = [],
//       rating = null,
//       status, // "watched" | "watchlist"
//       liked = false
//     } = req.body;

//     if (!tmdbId || !mediaType || !title || !status) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const watchedAt = status === "watched" ? new Date() : null;

//     const userMedia = await UserMedia.findOneAndUpdate(
//       { user: userId },
//       {
//         $addToSet: {
//           media: {
//             tmdbId,
//             mediaType,
//             title,
//             posterPath,
//             genres,
//             rating,
//             status,
//             liked,
//             watchedAt
//           }
//         }
//       },
//       { new: true, upsert: true }
//     );

//     res.status(201).json(userMedia);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

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
      status, // "watched" | "watchlist"
      liked = false
    } = req.body;

    if (!tmdbId || !mediaType || !title || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const watchedAt = status === "watched" ? new Date() : null;

    // 1️⃣ Find user media document
    let userMedia = await UserMedia.findOne({ user: userId });

    // 2️⃣ If no document → create new
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
          watchedAt
        }]
      });

      return res.status(201).json(userMedia);
    }

    // 3️⃣ Check if media already exists
    const existingMedia = userMedia.media.find(
      item => item.tmdbId === tmdbId
    );

    // 4️⃣ If exists → UPDATE
    if (existingMedia) {
      existingMedia.status = status;
      existingMedia.rating = rating;
      existingMedia.liked = liked;
      existingMedia.genres = genres;
      existingMedia.posterPath = posterPath;
      existingMedia.watchedAt = watchedAt;

      await userMedia.save();

      return res.status(200).json({
        message: "Media updated",
        media: existingMedia
      });
    }

    // 5️⃣ If NOT exists → ADD
    userMedia.media.push({
      tmdbId,
      mediaType,
      title,
      posterPath,
      genres,
      rating,
      status,
      liked,
      watchedAt
    });

    await userMedia.save();

    res.status(201).json({
      message: "Media added",
      media: userMedia.media[userMedia.media.length - 1]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /api/media
exports.getAllMedia = async (req, res) => {
  try {
    console.log("dgdg", req.params);
    const userMedia = await UserMedia.findOne({ user: req.params.id });
    res.json(userMedia?.media || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get status
// GET movie status by tmdbId
exports.getMovieStatus = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const userMedia = await UserMedia.findOne({ user: req.user.id });

    if (!userMedia) {
      return res.json({ status: null, liked: false });
    }

    const mediaItem = userMedia.media.find(
      item => item.tmdbId === Number(tmdbId)
    );

    if (!mediaItem) {
      return res.json({ status: null, liked: false });
    }

    res.json({
      status: mediaItem.status,   // "watched" | "watchlist"
      liked: mediaItem.liked,
      rating: mediaItem.rating,
      watchedAt: mediaItem.watchedAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/media/:status
exports.getByStatus = async (req, res) => {
  try {
    const { status } = req.params;
// console.log("statusjhkjh", status);
    const userMedia = await UserMedia.findOne({ user: req.user.id });

    const filtered = userMedia?.media.filter(
      item => item.status === status
    );

    res.json(filtered || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/media/:tmdbId
exports.updateMedia = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const updates = req.body;

    if (updates.status === "watched") {
      updates.watchedAt = new Date();
    }

    const userMedia = await UserMedia.findOneAndUpdate(
      {
        user: req.user.id,
        "media.tmdbId": Number(tmdbId)
      },
      {
        $set: {
          "media.$": {
            ...updates,
            tmdbId: Number(tmdbId)
          }
        }
      },
      { new: true }
    );

    res.json(userMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/media/:tmdbId/like
exports.toggleLike = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const userMedia = await UserMedia.findOne({ user: req.user.id });
    const mediaItem = userMedia.media.find(
      m => m.tmdbId === Number(tmdbId)
    );

    mediaItem.liked = !mediaItem.liked;
    await userMedia.save();

    res.json(mediaItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/media/:tmdbId
exports.deleteMedia = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const userMedia = await UserMedia.findOneAndUpdate(
      { user: req.user.id },
      {
        $pull: {
          media: { tmdbId: Number(tmdbId) }
        }
      },
      { new: true }
    );

    res.json(userMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

