import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env, logger } from "./config";
import authRoutes from "../src/routes/auth.routes";

const app: Application = express();

// Security Middleware
app.use(helmet());

// Cors configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// RateLimiter
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_MAX_REQUESTS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("Finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.path} ${res.statusCode}- ${duration}ms -${req.ip}`
    );
  });
  next();
});

// Helth check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NOD_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response) => {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message:
      env.NOD_ENV === "production" ? "Internal server error" : err.message,
    ...(env.NOD_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
