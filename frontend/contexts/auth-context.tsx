"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";
import { AuthContextType, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    console.log("=== AuthContext Init ===");
    console.log("Access Token:", token ? "exists" : "missing");

    if (!token) {
      console.log("No token, setting loading to false");
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        console.log("Fetching user from /auth/me...");
        const user = await authService.me();
        console.log("User loaded:", user);
        setUser(user);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ) => {
    try {
      await authService.register({
        email,
        password,
        firstName,
        lastName,
      });
      return {};
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      return { user }; // Return user for redirect logic
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      router.push("/auth/login");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      return {};
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
      return {};
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      await authService.changePassword(newPassword);
      return {};
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      await authService.resendVerification(email);
      return {};
    } catch (error: any) {
      return {
        error: getErrorMessage(error),
      };
    }
  };

  console.log("=== AuthContext State ===");
  console.log("Loading:", loading);
  console.log("User:", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword,
        resendVerificationEmail,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
