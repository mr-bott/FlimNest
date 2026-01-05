// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.cookies.access_token; // 👈 from HttpOnly cookie
//   // console.log('Auth Middleware - Token:', req.cookies.access_token);

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔥 IMPORTANT LINE
//     req.user = decoded;
//     // console.log('Authenticated user:', req.user);

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

module.exports = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    console.log('No session or userId found in session');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 🔥 SAME ROLE AS JWT DECODED PAYLOAD
  req.user = {
    id: req.session.userId
  };

  next();
};

