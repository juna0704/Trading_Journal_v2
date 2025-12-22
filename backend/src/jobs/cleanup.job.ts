// backend/src/jobs/cleanup.job.ts

import { Queue, Worker } from "bullmq";
import { passwordService } from "../services/password.service";
import { logger } from "../config";
import { env } from "../config";

// Create queue for cleanup jobs
export const cleanupQueue = new Queue("cleanup", {
  connection: {
    host: env.REDIS_URL ? new URL(env.REDIS_URL).hostname : "localhost",
    port: env.REDIS_URL ? parseInt(new URL(env.REDIS_URL).port) : 6379,
  },
});

// Schedule cleanup job (run daily at 2 AM)
export const scheduleCleanupJobs = async () => {
  await cleanupQueue.add(
    "cleanup-password-reset-attempts",
    {},
    {
      repeat: {
        pattern: "0 2 * * *", // Cron: Every day at 2 AM
      },
    }
  );

  logger.info("Scheduled cleanup jobs");
};

// Worker to process cleanup jobs
export const cleanupWorker = new Worker(
  "cleanup",
  async (job) => {
    if (job.name === "cleanup-password-reset-attempts") {
      logger.info("Running password reset attempts cleanup");
      const result = await passwordService.cleanupOldAttempts();
      logger.info("Cleanup completed", { deletedCount: result.count });
      return result;
    }
  },
  {
    connection: {
      host: env.REDIS_URL ? new URL(env.REDIS_URL).hostname : "localhost",
      port: env.REDIS_URL ? parseInt(new URL(env.REDIS_URL).port) : 6379,
    },
  }
);

cleanupWorker.on("completed", (job) => {
  logger.info("Cleanup job completed", { jobId: job.id });
});

cleanupWorker.on("failed", (job, err) => {
  logger.error("Cleanup job failed", { jobId: job?.id, error: err });
});
