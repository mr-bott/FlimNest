module.exports = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  //  SAME ROLE AS JWT DECODED PAYLOAD
  req.user = {
    id: req.session.userId
  };

  next();
};

