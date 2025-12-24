import { useState } from "react";
import { AdminUser } from "../types";
import { cn } from "@/lib/cn";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function AdminUsersTable({
  users,
  actionLoading,
  activate,
  deactivate,
}: {
  users: AdminUser[];
  actionLoading: string | null;
  activate: (id: string) => void;
  deactivate: (id: string) => void;
}) {
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null);

  const handleConfirmDeactivate = async () => {
    if (!confirmUser) return;
    await deactivate(confirmUser.id);
    setConfirmUser(null);
  };

  return (
    <>
      <div className="glass-strong rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-charcoal/60 dark:text-cream/60">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-tan/30 dark:divide-beige/20">
              {users.map((user) => {
                const isLoading = actionLoading === user.id;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-tan/20 dark:hover:bg-beige/10 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-charcoal/10 dark:bg-cream/10 flex items-center justify-center font-semibold">
                          {user.firstName[0]}
                          {user.lastName?.[0] ?? ""}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs opacity-60">{user.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                          user.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        )}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">{user.email}</td>

                    <td className="px-6 py-4 text-right">
                      {user.isActive ? (
                        <button
                          disabled={isLoading}
                          onClick={() => setConfirmUser(user)}
                          className="px-3 py-2 rounded-lg text-sm font-medium
                            bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400
                            hover:opacity-80 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          disabled={isLoading}
                          onClick={() => activate(user.id)}
                          className="px-3 py-2 rounded-lg text-sm font-medium
                            bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
                            hover:opacity-80 disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmUser}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${
          confirmUser?.firstName ?? "this user"
        }? They will be logged out and lose access immediately.`}
        confirmText="Deactivate"
        destructive
        loading={!!confirmUser && actionLoading === confirmUser.id}
        onCancel={() => setConfirmUser(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </>
  );
}
