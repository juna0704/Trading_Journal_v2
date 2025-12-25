"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validators/auth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error: resetError } = await forgotPassword(email);
    setLoading(false);

    if (resetError) {
      if (resetError.toLowerCase().includes("rate limit")) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(error);
      }
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
            We've sent a password reset link to <strong>{email}</strong>. Click
            the link in the email to reset your password.
          </p>
          <Link href="/auth/login">
            <ThemedButton className="w-full">Back to Sign In</ThemedButton>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-charcoal/70 dark:text-cream/70 hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
          <h1 className="font-display text-3xl font-bold text-charcoal dark:text-cream">
            Forgot Password?
          </h1>
          <p className="text-charcoal/70 dark:text-cream/70">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
            <ThemedInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              className="pl-10"
            />
          </div>

          <ThemedButton type="submit" loading={loading} className="w-full">
            Send Reset Link
          </ThemedButton>
        </form>
      </div>
    </AuthLayout>
  );
}
