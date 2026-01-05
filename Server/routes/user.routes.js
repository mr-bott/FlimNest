const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const auth = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/reteLimiter.middleware');
// implement auth later

router.post("/", auth, userCtrl.createUser);

router.get("/", rateLimiter({
    windowSeconds: 60,
    maxRequests: 10,
}), userCtrl.getUsers);

router.get("/:id", auth, userCtrl.getUserById);
router.put("/:id", auth, userCtrl.updateUser);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
