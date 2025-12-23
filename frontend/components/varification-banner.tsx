"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { ThemedButton } from "./ui/themed-button";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";

export function VerificationBanner() {
  const { user, resendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user || user.email || dismissed) return null;

  const handleResend = async () => {
    setLoading(true);
    const { error } = await resendVerificationEmail();
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to resend verification email");
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
  };

  return (
    <div className="relative bg-blush/50 dark:bg-blush/10 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-charcoal dark:text-cream">
            Email verification required
          </h3>
          <p className="text-sm text-charcoal/70 dark:text-cream/70 mt-1">
            Please verify your email address to access all features. Check your
            inbox for the verification link.
          </p>
          <ThemedButton
            variant="outline"
            size="sm"
            onClick={handleResend}
            loading={loading}
            className="mt-3"
          >
            Resend verification email
          </ThemedButton>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-charcoal/50 hover:text-charcoal dark:text-cream/50 dark:hover:text-cream transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
