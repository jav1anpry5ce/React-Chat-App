const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
});

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format
    ),
  }),
  new DailyRotateFile({
    filename: "logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "debug",
  }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
  }),
];

const logger = winston.createLogger({
  level: "debug",
  levels,
  format,
  transports,
});

module.exports = logger;
