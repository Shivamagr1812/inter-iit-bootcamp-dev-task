const winston = require("winston");

winston.addColors({
  error: "red", // Error logs will be red
  warn: "yellow", // Warning logs will be yellow
  info: "cyan", // Info logs will be cyan
  http: "magenta", // HTTP logs will be magenta
  debug: "green", // Debug logs will be green
});

const logFormat = winston.format.combine(
  winston.format.colorize(), // Colorize the output based on log level
  winston.format.timestamp({
    // Add timestamp to each log entry
    format: "YYYY-MM-DD | HH:mm:ss", // Customize the timestamp format
  }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level}]: ${message}`; // Format with square brackets
  }),
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat, // Use the custom log format
  transports: [
    // Write all logs of level `error` to `error.log`
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // Write all logs of level `info` or lower to `combined.log`
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If not in production, log to the console with colored output and square-bracket format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: logFormat, // Apply the custom format to console logs as well
    }),
  );
}

module.exports = logger;
