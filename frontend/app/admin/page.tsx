"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUser";
import { AdminStats } from "@/features/admin/components/AdminStats";
import { AdminUsersTable } from "@/features/admin/components/AdminUserTable";

export default function AdminPage() {
  const { users, stats, loading, activate, deactivate, actionLoading } =
    useAdminUsers();

  if (loading) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <AdminStats stats={stats} />

          <AdminUsersTable
            users={users}
            activate={activate}
            deactivate={deactivate}
            actionLoading={actionLoading}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
