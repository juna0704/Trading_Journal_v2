"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { loginSchema } from "@/lib/validators/auth";
import { getErrorMessage } from "@/lib/api-error";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-charcoal dark:text-cream">
            Welcome Back
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            Sign in to continue tracking your trades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="h-4 w-4 rounded border-tan dark:border-beige/30 text-charcoal dark:text-cream focus:ring-2 focus:ring-charcoal dark:focus:ring-cream"
              />
              <span className="text-sm text-charcoal dark:text-cream">
                Remember me
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-charcoal dark:text-cream hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <ThemedButton type="submit" loading={loading} className="w-full">
            Sign In
          </ThemedButton>
        </form>

        <div className="text-center text-sm">
          <span className="text-charcoal/70 dark:text-cream/70">
            Don't have an account?{" "}
          </span>
          <Link
            href="/auth/register"
            className="font-semibold text-charcoal dark:text-cream hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
