import { apiClient } from "@/services/api/client";
import type { ChangePasswordBody } from "@/app/api/auth/change-password/schema";

export const changePasswordApi = {
  changePassword: (body: ChangePasswordBody) => apiClient.post<void>("/auth/change-password", body),
};
