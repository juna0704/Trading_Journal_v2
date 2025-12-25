"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { PasswordStrength } from "@/components/ui/password-strength";
import { toast } from "sonner";
import { Lock, CheckCircle2, XCircle } from "lucide-react";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { getErrorMessage } from "@/lib/api-error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error || errorDescription) {
      setTokenError(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[field.toString()] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      setTokenError(true);
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(token, formData.password);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  };

  if (tokenError) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
            Invalid or Expired Link
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <ThemedButton
            onClick={() => router.push("/auth/forgot-password")}
            className="w-full"
          >
            Request New Link
          </ThemedButton>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
            Password Updated
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            Your password has been successfully reset. Redirecting to sign in...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-charcoal dark:text-cream">
            Reset Password
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
              <ThemedInput
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                className="pl-10"
              />
            </div>
            <div className="mt-2">
              <PasswordStrength password={formData.password} />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              className="pl-10"
            />
          </div>

          <ThemedButton type="submit" loading={loading} className="w-full">
            Reset Password
          </ThemedButton>
        </form>
      </div>
    </AuthLayout>
  );
}
