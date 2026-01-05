const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { getUserProfile } = require("../controllers/profile.controller");

router.get("/", auth, getUserProfile);

module.exports = router;
