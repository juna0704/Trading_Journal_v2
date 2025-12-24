"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isActive || !user.isEmailVerified)) {
      router.replace("/account-status");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <>{children}</>;
}
