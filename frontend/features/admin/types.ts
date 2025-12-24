/**
 * Admin User Type
 * ----------------
 */

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: string;

  // Identity
  email: string;
  firstName: string;
  lastName: string | null;

  // Authorization
  role: UserRole;

  // Account state
  isActive: boolean;
  isEmailVerified: boolean;

  // Activity tracking
  lastLoginAt: string | null;
  createdAt: string;
}

/**
 * Admin User Stats
 * ----------------
 * Aggregated stats used by AdminStats component
 */
export interface AdminUserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  pendingApproval: number;
}

/**
 * Admin Users API Response
 * ------------------------
 * Strong typing for backend response
 */
export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
  };
}

/**
 * Admin Action State
 * ------------------
 * Used for tracking activate / deactivate loading
 */
export type AdminActionType = "activate" | "deactivate" | null;
