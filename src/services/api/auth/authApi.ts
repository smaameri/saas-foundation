import { apiClient } from "@/services/api/client";
import type { ChangePasswordBody } from "@/app/api/auth/change-password/schema";
import type { LoginBody } from "@/app/api/auth/login/schema";

export const authApi = {
  signIn: (body: LoginBody) => apiClient.post<void>("/auth/login", body),
  signOut: () => apiClient.post<void>("/auth/logout", {}),
  changePassword: (body: ChangePasswordBody) => apiClient.post<void>("/auth/change-password", body),
};
