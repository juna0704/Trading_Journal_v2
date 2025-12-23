"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { PasswordStrength } from "@/components/ui/password-strength";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, User, Lock, CheckCircle2 } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
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
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.name
    );
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to create account");
    } else {
      setSuccess(true);
    }
  };

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
            Check your email
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            We've sent a verification link to <strong>{formData.email}</strong>.
            Click the link in the email to verify your account.
          </p>
          <ThemedButton
            onClick={() => router.push("/auth/login")}
            className="w-full"
          >
            Go to Sign In
          </ThemedButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-charcoal dark:text-cream">
            Create Account
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            Start tracking your trades today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              className="pl-10"
            />
          </div>

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

          <div>
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
            <div className="mt-2">
              <PasswordStrength password={formData.password} />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Confirm Password"
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
            Create Account
          </ThemedButton>
        </form>

        <div className="text-center text-sm">
          <span className="text-charcoal/70 dark:text-cream/70">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/login"
            className="font-semibold text-charcoal dark:text-cream hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
