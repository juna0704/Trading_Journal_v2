import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// ============================================
// PUBLIC REGISTRATION
// ============================================
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: strongPassword,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

// ============================================
// ADMIN REGISTRATION (Admin creates users)
// ============================================

export const adminRegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: strongPassword,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z
      .enum(["USER", "ADMIN"], {
        errorMap: () => ({ message: "Role must be either USER or ADMIN" }),
      })
      .optional()
      .default("USER"),
  }),
});

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1),
  }),
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
  body: z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

// ============================================
// TOKEN REFRESH
// ============================================
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

// ============================================
// ADMIN USER APPROVAL
// ============================================

export const approveUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["query"];
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>["body"];
export type ApproveUserInput = z.infer<typeof approveUserSchema>["params"];
