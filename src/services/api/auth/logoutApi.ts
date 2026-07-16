import { apiClient } from "@/services/api/client";

export const logoutApi = {
  signOut: () => apiClient.post<void>("/auth/logout", {}),
};
