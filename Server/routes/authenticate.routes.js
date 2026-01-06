const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
  if (!req.cookies?.sid) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true });
});
module.exports = router;