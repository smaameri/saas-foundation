import type { CreateApiKeyBody, ListApiKeysParams } from "@/app/api/admin/api-keys/schema";
import type { PaginationData } from "@/app/api/response";
import { apiClient } from "@/services/api/client";
import type { ApiKey, CreatedApiKey } from "@/services/api/types/apiKey";

export const apiKeysApi = {
  listApiKeys(params?: ListApiKeysParams): Promise<{ data: ApiKey[]; pagination: PaginationData }> {
    return apiClient.getPaginated<ApiKey>("/admin/api-keys", params);
  },

  createApiKey(params: CreateApiKeyBody): Promise<CreatedApiKey> {
    return apiClient.post<CreatedApiKey>("/admin/api-keys", params);
  },

  deleteApiKey(id: string): Promise<void> {
    return apiClient.delete(`/admin/api-keys/${id}`);
  },
};
