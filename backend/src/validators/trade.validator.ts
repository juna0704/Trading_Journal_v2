import { z } from "zod";
import { TradeSide } from "../generated/prisma";

// Custom refinements
const positiveNumber = z.number().positive("Must be a positive number");
const nonNegativeNumber = z.number().min(0, "Must be non-negative");

export const tradeCreateSchema = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol is required")
      .max(10, "Symbol must be 10 characters or less")
      .toUpperCase()
      .regex(
        /^[A-Z0-9]+$/,
        "Symbol must contain only uppercase letters and numbers"
      ),

    side: z.nativeEnum(TradeSide, {
      errorMap: () => ({ message: "Side must be LONG or SHORT" }),
    }),

    entryPrice: positiveNumber.refine(
      (val) => val < 1000000000,
      "Entry price is unreasonably high"
    ),

    exitPrice: positiveNumber
      .refine((val) => val < 1000000000, "Exit price is unreasonably high")
      .optional(),

    quantity: positiveNumber
      .refine((val) => val <= 1000000, "Quantity cannot exceed 1,000,000")
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
  .refine(
    (data) => {
      // If exitTimestamp is provided, exitPrice must also be provided
      if (data.exitTimestamp && !data.exitPrice) {
        return false;
      }
      return true;
    },
    {
      message: "Exit price is required when exit timestamp is provided",
      path: ["exitPrice"],
    }
  )
  .refine(
    (data) => {
      // Entry timestamp must be before exit timestamp
      if (data.exitTimestamp) {
        return new Date(data.entryTimestamp) < new Date(data.exitTimestamp);
      }
      return true;
    },
    {
      message: "Entry timestamp must be before exit timestamp",
      path: ["exitTimestamp"],
    }
  );

export const tradeUpdateSchema = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol cannot be empty")
      .max(10, "Symbol must be 10 characters or less")
      .toUpperCase()
      .regex(
        /^[A-Z0-9]+$/,
        "Symbol must contain only uppercase letters and numbers"
      )
      .optional(),

    side: z.nativeEnum(TradeSide).optional(),

    entryPrice: positiveNumber
      .refine((val) => val < 1000000000, "Entry price is unreasonably high")
      .optional(),

    exitPrice: positiveNumber
      .refine((val) => val < 1000000000, "Exit price is unreasonably high")
      .optional()
      .nullable(),

    quantity: positiveNumber
      .refine((val) => val <= 1000000, "Quantity cannot exceed 1,000,000")
      .optional(),

    leverage: z
      .number()
      .int("Leverage must be an integer")
      .min(1, "Leverage must be at least 1")
      .max(125, "Leverage cannot exceed 125")
      .optional(),

    fees: nonNegativeNumber.optional(),

    stopLoss: positiveNumber.optional().nullable(),

    takeProfit: positiveNumber.optional().nullable(),

    entryTimestamp: z
      .string()
      .datetime("Invalid entry timestamp format")
      .optional(),

    exitTimestamp: z
      .string()
      .datetime("Invalid exit timestamp format")
      .optional()
      .nullable(),

    strategyId: z.string().uuid("Invalid strategy ID").optional().nullable(),

    notes: z
      .string()
      .max(2000, "Notes cannot exceed 2000 characters")
      .optional()
      .nullable(),

    tags: z
      .array(z.string().max(50, "Tag cannot exceed 50 characters"))
      .max(10, "Cannot have more than 10 tags")
      .optional(),

    screenshotUrl: z
      .string()
      .url("Invalid screenshot URL")
      .optional()
      .nullable(),

    tradeScore: z
      .number()
      .int("Trade score must be an integer")
      .min(1, "Trade score must be at least 1")
      .max(100, "Trade score cannot exceed 100")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // If exitTimestamp is provided, exitPrice must also be provided
      if (data.exitTimestamp && data.exitPrice === undefined) {
        return false;
      }
      return true;
    },
    {
      message: "Exit price is required when exit timestamp is provided",
      path: ["exitPrice"],
    }
  );

export const tradeIdSchema = z.object({
  id: z.string().cuid("Invalid trade ID format"),
});
