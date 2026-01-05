const mongoose = require("mongoose");

const watchedMovieItemSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    posterPath: String,

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    genres: {
      type: [Number], // TMDB genre IDs
      default: [],
    },

    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // prevents extra _id for each movie
);

const watchedMovieSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    watchedMovies: [watchedMovieItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchedMovie", watchedMovieSchema);
