// rateLimiter.js
const redisClient = require('../rateLimiter/redisClient');

const rateLimiter = ({
  windowSeconds = 60,
  maxRequests = 100
}) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip; // or req.user.id
      const key = `rate:${identifier}`;

      const currentCount = await redisClient.incr(key);

      if (currentCount === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (currentCount > maxRequests) {
        return res.status(429).json({
          message: 'Too many requests. Please try again later.'
        });
      }

      next();
    } catch (err) {
      // Fail-open strategy
      next();
    }
  };
};

module.exports = rateLimiter;
