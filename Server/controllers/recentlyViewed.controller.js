const WatchedMovie = require("../models/recentlyViewed.model");
// add a movie to watched list
exports.addWatchedMovie = async (req, res) => {
  const { tmdbId, mediaType, title, posterPath, rating, genres } = req.body;
  const userId = req.user.id;
  console.log(req)

  try {
    // 1️⃣ Find user record
    let record = await WatchedMovie.findOne({ user: userId });
    // 2️⃣ If record exists, check movie
    if (record) {
      const alreadyWatched = record.watchedMovies.find(
        movie =>
          movie.tmdbId === tmdbId &&
          movie.mediaType === mediaType
      );

      if (alreadyWatched) {
        return res.status(200).json({
          message: "Movie already exists in watched list"
        });
      }

      // 3️⃣ Save movie if not found
      record.watchedMovies.push({
        tmdbId,
        mediaType,
        title,
        posterPath,
        rating,
        genres,
        watchedAt: new Date()
      });

      await record.save();
    } 
    // 4️⃣ If user record does NOT exist, create it
    else {
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
            watchedAt: new Date()
          }
        ]
      });
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get watched movies for a user
exports.getWatchedMovies = async (req, res) => {
  const data = await WatchedMovie.findOne({
    user: req.user.id,
    // user: req.params.userId,
  }).populate("user", "name email");
  res.json(data?.watchedMovies || []);
};



exports.deleteWatchedMovie = async (req, res) => {
  const {  tmdbId } = req.params;

  try {
    const updated = await WatchedMovie.findOneAndUpdate(
      { user: req.user.id },
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

    res.json({
      message: "Movie removed from watched list",
      watchedMovies: updated.watchedMovies,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};