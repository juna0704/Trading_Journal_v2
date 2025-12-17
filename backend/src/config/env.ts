import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NOD_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default(5000),

  // Database
  // DATABASE_URL: z.string().url(),

  // Redis
  // REDIS_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(error.format(), null));
    process.exit(1);
  }
  throw error;
}

export default env;
