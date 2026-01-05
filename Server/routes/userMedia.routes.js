const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const userMediaCtrl = require("../controllers/userMedia.controller");

router.post("/media", auth, userMediaCtrl.addMedia);
router.get("/media",auth ,userMediaCtrl.getAllMedia);
router.get("/media/:status", auth, userMediaCtrl.getByStatus);
router.get('/media/status/:tmdbId', auth, userMediaCtrl.getMovieStatus);
router.put("/media/:tmdbId", auth, userMediaCtrl.updateMedia);
router.put("/media/:tmdbId/like", auth, userMediaCtrl.toggleLike);
router.delete("/media/:tmdbId", auth, userMediaCtrl.deleteMedia);

module.exports = router;
