"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { PasswordStrength } from "@/components/ui/password-strength";
import { toast } from "sonner";
import { z } from "zod";
import {
  CheckCircle2,
  AlertCircle,
  Lock,
  User,
  Mail,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const {
    user,
    resetPassword,
    signOut,
    resendVerificationEmail,
    changePassword,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = changePasswordSchema.safeParse(passwordData);
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
    const { error } = await changePassword(passwordData.newPassword);
    setLoading(false);

    if (error) {
      toast.error(error || "Failed to update password");
    } else {
      toast.success("Password updated successfully");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
  };

  const handleResendVerification = async (email: string) => {
    setLoading(true);
    const { error } = await resendVerificationEmail(email);
    setLoading(false);

    if (error) {
      toast.error(error || "Failed to resend verification email");
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl space-y-8 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-charcoal dark:text-cream">
              Settings
            </h1>
            <p className="mt-2 text-charcoal/70 dark:text-cream/70">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="glass-strong rounded-xl p-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream mb-4">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-charcoal/10 dark:bg-cream/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-5 w-5 text-charcoal dark:text-cream" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal/70 dark:text-cream/70">
                      Name
                    </p>
                    <p className="text-lg font-semibold text-charcoal dark:text-cream">
                      {user?.firstName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-charcoal/10 dark:bg-cream/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="h-5 w-5 text-charcoal dark:text-cream" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal/70 dark:text-cream/70">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-charcoal dark:text-cream">
                      {user?.email}
                    </p>
                    <div className="mt-2">
                      {user?.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush/50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                            <AlertCircle className="h-4 w-4" />
                            Not verified
                          </span>
                          <ThemedButton
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleResendVerification(user?.email || "")
                            }
                            loading={loading}
                          >
                            Resend verification
                          </ThemedButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-8">
            <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream mb-6">
              Change Password
            </h2>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 max-w-md"
            >
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
                  <ThemedInput
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    error={errors.newPassword}
                    className="pl-10"
                  />
                </div>
                <div className="mt-2">
                  <PasswordStrength password={passwordData.newPassword} />
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-[50px] transform -translate-y-1/2 h-5 w-5 text-charcoal/50 dark:text-cream/50" />
                <ThemedInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={errors.confirmPassword}
                  className="pl-10"
                />
              </div>

              <ThemedButton type="submit" loading={loading}>
                Update Password
              </ThemedButton>
            </form>
          </div>

          <div className="glass-strong rounded-xl p-8 border-2 border-red-200 dark:border-red-900/30">
            <h2 className="font-display text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <p className="text-charcoal/70 dark:text-cream/70">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <ThemedButton
                variant="danger"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </ThemedButton>
            </div>
          </div>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-charcoal dark:text-cream">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-charcoal/70 dark:text-cream/70">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3">
              <ThemedButton
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </ThemedButton>
              <ThemedButton
                variant="danger"
                onClick={() => {
                  toast.error("Account deletion is not yet implemented");
                  setDeleteDialogOpen(false);
                }}
              >
                I understand, delete my account
              </ThemedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
