import { apiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { ApiKey } from "@/services/api/types/apiKey";
import type { PaginationData } from "@/app/api/response";

export const apiKeysApi = {
  listApiKeys(params?: ListParams): Promise<{ data: ApiKey[]; pagination: PaginationData }> {
    return apiClient.getPaginated<ApiKey>("/admin/api-keys", params);
  },

  deleteApiKey(id: string): Promise<void> {
    return apiClient.delete(`/admin/api-keys/${id}`);
  },
};
