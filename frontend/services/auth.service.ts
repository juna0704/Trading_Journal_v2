import apiClient from "@/lib/api";

export const authService = {
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
  }) {
    return apiClient.post("/auth/register", data);
  },

  login(data: { email: string; password: string }) {
    return apiClient.post("/auth/login", data);
  },

  logout() {
    return apiClient.post("/auth/logout");
  },

  me() {
    return apiClient.get("/auth/me");
  },

  forgotPassword(email: string) {
    return apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword(token: string, newPassword: string) {
    return apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
  },

  verifyEmail(token: string) {
    return apiClient.post("/auth/verify-email", { token });
  },
};
