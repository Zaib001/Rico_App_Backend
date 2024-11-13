const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(), // Adds timestamp to logs
    logFormat // Use the custom format defined above
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/app.log' }) // Log to a file
  ]
});


module.exports = logger;
