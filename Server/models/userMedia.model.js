const mongoose = require("mongoose");

const userMediaItemSchema = new mongoose.Schema(
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

    genres: {
      type: [Number], // TMDB genre IDs
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    // 👇 WATCHED or WATCHLIST
    status: {
      type: String,
      enum: ["watched", "watchlist"],
      required: true,
    },

    // 👇 LIKE flag
    liked: {
      type: Boolean,
      default: false,
    },

    watchedAt: {
      type: Date,
      default: null, // set only when status = watched
    },

    addedAt: {
      type: Date,
      default: Date.now, // when added to watchlist / liked
    },
  },
  { _id: false }
);

const userMediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    media: [userMediaItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserMedia", userMediaSchema);
