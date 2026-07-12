import { apiClient } from "@/services/api/client";
import type { UpdateAccountBody } from "@/app/api/admin/account/schema";

export const accountApi = {
  updateAccount(body: UpdateAccountBody): Promise<void> {
    return apiClient.patch("/admin/account", body);
  },
};
