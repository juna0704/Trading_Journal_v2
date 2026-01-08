import { z } from "zod";

/**
 * Strategy creation payload
 */
const strategyCreatePayload = z.object({
  name: z
    .string()
    .min(1, "Strategy name is required")
    .max(100, "Strategy name must be at most 100 characters")
    .transform((val) => val.trim()),
});

/**
 * Strategy update payload
 */
const strategyUpdatePayload = z.object({
  name: z
    .string()
    .min(1, "Strategy name cannot be empty")
    .max(100, "Strategy name must be at most 100 characters")
    .transform((val) => val.trim())
    .optional(),
});

/**
 * Strategy ID param
 */
const strategyIdParams = z.object({
  id: z.string().uuid("Invalid strategy ID"),
});

/**
 * Routes
 */
export const createStrategySchema = z.object({
  body: strategyCreatePayload,
});

export const updateStrategySchema = z.object({
  params: strategyIdParams,
  body: strategyUpdatePayload,
});

export const strategyByIdSchema = z.object({
  params: strategyIdParams,
});
