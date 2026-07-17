import { apiClient } from "@/services/api/client";
import type { ChangePasswordBody } from "@/app/api/auth/change-password/schema";
import type { LoginBody } from "@/app/api/auth/login/schema";
import type { CheckPermissionsBody } from "@/app/api/auth/permissions/check/schema";
import type { ResetPasswordBody } from "@/app/api/auth/reset-password/schema";

export const authApi = {
  signIn: (body: LoginBody) => apiClient.post<void>("/auth/login", body),
  signOut: () => apiClient.post<void>("/auth/logout", {}),
  changePassword: (body: ChangePasswordBody) => apiClient.post<void>("/auth/change-password", body),
  resetPassword: (body: ResetPasswordBody) => apiClient.post<void>("/auth/reset-password", body),
  getSession: () => apiClient.get<{ role: string | null }>("/auth/session"),
  checkPermissions: (body: CheckPermissionsBody) =>
    apiClient.post<{ allowed: boolean }>("/auth/permissions/check", body),
};
