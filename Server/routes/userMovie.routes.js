const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userMovie.controller");

// add liked / watched / watchlist
router.post("/", ctrl.addUserMovie);

// all movies of user
router.get("/user/:userId", ctrl.getUserMovies);

// by status
router.get("/user/:userId/:status", ctrl.getByStatus);

// update
router.put("/:id", ctrl.updateUserMovie);

// delete
router.delete("/:id", ctrl.deleteUserMovie);

module.exports = router;
