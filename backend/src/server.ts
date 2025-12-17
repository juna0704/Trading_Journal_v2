import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config";
import env from "./config/env";
import logger from "./config/logger";

const PORT = env.PORT || 5000;

let server: any;

const startServer = async () => {
  try {
    // Connection to database
    await connectDatabase();

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${env.NOD_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (!server) {
    logger.warn("Server not initialized. Exiting process");
  }

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed");

      try {
        await disconnectDatabase();
        logger.info("Database disconnected");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    });
  }

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

/**
 * OS signals
 */
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/**
 * Runtime errors
 */
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason as Error);
  gracefulShutdown("unhandledRejection");
});

startServer();
