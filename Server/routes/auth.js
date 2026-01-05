const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.regenerate((err) => {
      if (err) return res.status(500).send("Session error");

      req.session.userId = req.user._id;
      req.session.provider = "google";
      req.session.save(() => {
        // FORCE SESSION WRITE
        res.redirect("http://localhost:4200/oauth-success");
      });
    });
  }
);

module.exports = router;
