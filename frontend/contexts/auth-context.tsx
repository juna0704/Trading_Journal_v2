// frontend/contexts/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<{ error: any }>;
  verifyEmail: (token: string) => Promise<{ error: any }>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ error: any }>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Clear invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Registration failed",
          details: error.response?.data?.details,
        },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Set user
      setUser(userData);

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Login failed",
        },
      };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      router.push("/");
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await apiClient.post("/auth/resend-verification");
      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message:
            error.response?.data?.error ||
            "Failed to resend verification email",
        },
      };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await apiClient.post("/auth/verify-email", { token });

      // Refresh user data after verification
      const response = await apiClient.get("/auth/me");
      setUser(response.data.user);

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Email verification failed",
        },
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await apiClient.post("/auth/forgot-password", { email });
      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Failed to send reset email",
        },
      };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Password reset failed",
        },
      };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken } = response.data;
      localStorage.setItem("accessToken", newAccessToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resendVerificationEmail,
        verifyEmail,
        forgotPassword,
        resetPassword,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
