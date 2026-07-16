import { apiClient } from "@/services/api/client";
import type { LoginBody } from "@/app/api/auth/login/schema";

export const loginApi = {
  signIn: (body: LoginBody) => apiClient.post<void>("/auth/login", body),
};
