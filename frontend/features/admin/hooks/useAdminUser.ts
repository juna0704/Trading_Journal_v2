import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { AdminUser } from "../types";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activate = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminService.activateUser(userId);
      toast.success("User activated");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const deactivate = async (userId: string) => {
    if (!confirm("Deactivate this user?")) return;
    setActionLoading(userId);

    try {
      await adminService.deactivateUser(userId);
      toast.success("User deactivated");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    verified: users.filter((u) => u.isEmailVerified).length,
  };

  return {
    users,
    stats,
    loading,
    actionLoading,
    activate,
    deactivate,
  };
}
