const UserMovie = require("../models/userMovie.model");

// ADD movie/show
exports.addUserMovie = async (req, res) => {
  try {
    const item = await UserMovie.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all movies of a user
exports.getUserMovies = async (req, res) => {
  const movies = await UserMovie.find({ user: req.params.userId });
  res.json(movies);
};

// GET by status (liked / watched / watchlist)
exports.getByStatus = async (req, res) => {
  const movies = await UserMovie.find({
    user: req.params.userId,
    status: req.params.status,
  });
  res.json(movies);
};

// UPDATE movie (rating / status)
exports.updateUserMovie = async (req, res) => {
  const movie = await UserMovie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(movie);
};

// DELETE movie
exports.deleteUserMovie = async (req, res) => {
  await UserMovie.findByIdAndDelete(req.params.id);
  res.json({ message: "Movie removed" });
};
