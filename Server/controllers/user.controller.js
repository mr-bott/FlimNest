const User = require("../models/user.model");
const redisClient = require("../rateLimiter/redisClient");

exports.createUser = async (req, res) => {
  try {

    if (req.body.provider === "local" && !req.body.password) {
     
      return res.status(400).json({
        error: "Password is required for local users",
      });

    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// GET single user
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
};

// DELETE user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
