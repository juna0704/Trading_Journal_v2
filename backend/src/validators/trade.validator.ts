import { z } from "zod";
import { TradeSide, TradeStatus } from "../generated/prisma";

/* -------------------------------------------------------------------------- */
/*                               Reusable fields                              */
/* -------------------------------------------------------------------------- */

const positiveNumber = z.number().positive("Must be a positive number");
const nonNegativeNumber = z.number().min(0, "Must be non-negative");

/* -------------------------------------------------------------------------- */
/*                              Base payload schemas                           */
/* -------------------------------------------------------------------------- */

/**
 * Trade creation payload (req.body)
 */
const tradeCreatePayload = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol is required")
      .max(10, "Symbol must be 10 characters or less")
      .toUpperCase()
      .regex(/^[A-Z0-9]+$/, "Symbol must contain only letters and numbers"),

    side: z.nativeEnum(TradeSide, {
      errorMap: () => ({ message: "Side must be LONG or SHORT" }),
    }),

    entryPrice: positiveNumber.refine(
      (val) => val < 1_000_000_000,
      "Entry price is unreasonably high"
    ),

    exitPrice: positiveNumber
      .refine((val) => val < 1_000_000_000, "Exit price is unreasonably high")
      .optional(),

    quantity: positiveNumber
      .refine((val) => val <= 1_000_000, "Quantity cannot exceed 1,000,000")
      .refine(
        (val) => val >= 0.00000001,
        "Quantity must be at least 0.00000001"
      ),

    leverage: z
      .number()
      .int("Leverage must be an integer")
      .min(1, "Leverage must be at least 1")
      .max(125, "Leverage cannot exceed 125")
      .optional()
      .default(1),

    fees: nonNegativeNumber.optional().default(0),

    stopLoss: positiveNumber.optional(),
    takeProfit: positiveNumber.optional(),

    entryTimestamp: z
      .string()
      .datetime("Invalid entry timestamp format")
      .refine(
        (val) => new Date(val) <= new Date(),
        "Entry timestamp cannot be in the future"
      ),

    exitTimestamp: z
      .string()
      .datetime("Invalid exit timestamp format")
      .optional(),

    strategyId: z.string().uuid("Invalid strategy ID").optional(),

    notes: z
      .string()
      .max(2000, "Notes cannot exceed 2000 characters")
      .optional(),

    tags: z
      .array(z.string().max(50, "Tag cannot exceed 50 characters"))
      .max(10, "Cannot have more than 10 tags")
      .optional()
      .default([]),

    screenshotUrl: z.string().url("Invalid screenshot URL").optional(),
  })
  .refine((data) => !data.exitTimestamp || !!data.exitPrice, {
    message: "Exit price is required when exit timestamp is provided",
    path: ["exitPrice"],
  })
  .refine(
    (data) =>
      !data.exitTimestamp ||
      new Date(data.entryTimestamp) < new Date(data.exitTimestamp),
    {
      message: "Entry timestamp must be before exit timestamp",
      path: ["exitTimestamp"],
    }
  );

/**
 * Trade update payload (req.body)
 */
const tradeUpdatePayload = z
  .object({
    symbol: z
      .string()
      .min(1)
      .max(10)
      .toUpperCase()
      .regex(/^[A-Z0-9]+$/)
      .optional(),

    side: z.nativeEnum(TradeSide).optional(),

    entryPrice: positiveNumber.optional(),

    exitPrice: positiveNumber.optional().nullable(),

    quantity: positiveNumber.optional(),

    leverage: z.number().int().min(1).max(125).optional(),

    fees: nonNegativeNumber.optional(),

    stopLoss: positiveNumber.optional().nullable(),
    takeProfit: positiveNumber.optional().nullable(),

    entryTimestamp: z.string().datetime().optional(),

    exitTimestamp: z.string().datetime().optional().nullable(),

    strategyId: z.string().uuid().optional().nullable(),

    notes: z.string().max(2000).optional().nullable(),

    tags: z.array(z.string().max(50)).max(10).optional(),

    screenshotUrl: z.string().url().optional().nullable(),

    tradeScore: z.number().int().min(1).max(100).optional().nullable(),
  })
  .refine((data) => !data.exitTimestamp || data.exitPrice !== undefined, {
    message: "Exit price is required when exit timestamp is provided",
    path: ["exitPrice"],
  });

/**
 * Trade ID (req.params)
 */
const tradeIdParams = z.object({
  id: z.string().cuid("Invalid trade ID format"),
});

/* -------------------------------------------------------------------------- */
/*                              Route-level schemas                            */
/* -------------------------------------------------------------------------- */

/**
 * POST /api/trades
 */
export const createTradeSchema = z.object({
  body: tradeCreatePayload,
});

/**
 * PUT /api/trades/:id
 */
export const updateTradeSchema = z.object({
  params: tradeIdParams,
  body: tradeUpdatePayload,
});

/**
 * GET /api/trades/:id
 */
export const tradeByIdSchema = z.object({
  params: tradeIdParams,
});

/**
 * GET /api/trades (paginated & filtered)
 */
export const listTradesSchema = z.object({
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    status: z.nativeEnum(TradeStatus).optional(),
    side: z.nativeEnum(TradeSide).optional(),
    symbol: z.string().optional(),
    strategyId: z.string().uuid().nullable().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});
