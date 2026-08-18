// src/config/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(), // logs to console
    // In production you can add:
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' })
  ],
});

module.exports = logger;
