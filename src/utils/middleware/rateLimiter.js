// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // limit each IP to 10 requests
  message: {
    success: false,
    status: 429,
    message: "Too many login attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
