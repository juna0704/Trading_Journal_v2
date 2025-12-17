import winston from "winston";
import env from "./env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ leavel, message, timestamp, stack }) => {
  return `${timestamp} ${leavel}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: env.NOD_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

export default logger;
