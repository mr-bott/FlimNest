const mongoose = require("mongoose");

const userMovieSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    posterPath: {
      type: String,
    },

    status: {
      type: String,
      enum: ["liked", "watched", "watchlist"],
      required: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    watchedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// prevent duplicate entries
userMovieSchema.index(
  { user: 1, tmdbId: 1, status: 1 },
  { unique: true }
);

module.exports = mongoose.model("UserMovie", userMovieSchema);
