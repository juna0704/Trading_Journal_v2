import apiClient from "@/lib/api";

export const adminService = {
  getAllUsers() {
    return apiClient.get("/admin/users");
  },

  getPendingUsers() {
    return apiClient.get("/admin/pending-users");
  },

  activateUser(userId: string) {
    return apiClient.post(`/admin/activate/${userId}`);
  },

  deactivateUser(userId: string) {
    return apiClient.post(`/admin/deactivate/${userId}`);
  },
};
