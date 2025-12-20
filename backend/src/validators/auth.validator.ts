import { z } from "zod";

// ============================================
// PUBLIC REGISTRATION
// ============================================
export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z
    .string()
    .min(1, "First name too short")
    .max(100, "Fist name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name too short")
    .max(100, "Last name too long")
    .optional(),
});

// ============================================
// ADMIN REGISTRATION (Admin creates users)
// ============================================

export const adminRegisterSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name too long")
    .optional(),
  role: z
    .enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "Role must be either USER or ADMIN" }),
    })
    .optional()
    .default("USER"),
});

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Invalid email address"),
  }),
});

// ============================================
// LOGIN
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// ============================================
// TOKEN REFRESH
// ============================================
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ============================================
// ADMIN USER APPROVAL
// ============================================

export const approveUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ApproveUserInput = z.infer<typeof approveUserSchema>;
