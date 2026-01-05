const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/recentlyViewed.controller");
const auth = require('../middleware/auth.middleware');

router.post("/", auth, ctrl.addWatchedMovie);
router.get("/", auth,ctrl.getWatchedMovies);
router.delete("/:userId/:tmdbId", auth, ctrl.deleteWatchedMovie);

module.exports = router;
