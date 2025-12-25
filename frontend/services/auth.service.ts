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

  async login(data: { email: string; password: string }) {
    const response = await apiClient.post("/auth/login", data);

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Invalid Login response");
    }

    return response.data.data;
  },

  logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    return apiClient.post("/auth/logout", { refreshToken });
  },

  async me() {
    const response = await apiClient.get("/auth/me");

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Invalid response from /auth/me");
    }

    // Return just the user object
    return response.data.data.user;
  },

  changePassword(newPassword: string) {
    return apiClient.post("/auth/change-password", { newPassword });
  },

  forgotPassword(email: string) {
    return apiClient.post("/password/request-reset", { email });
  },

  resetPassword(token: string, newPassword: string) {
    return apiClient.post("/password/reset", {
      token,
      newPassword,
    });
  },

  verifyEmail(token: string) {
    return apiClient.get(`/auth/verify-email?token=${token}`);
  },

  resendVerification(email: string) {
    return apiClient.post("/auth/resend-verification", { email });
  },
};
