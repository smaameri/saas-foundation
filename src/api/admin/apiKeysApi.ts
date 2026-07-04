import { apiClient } from "@/api/client";
import type { ApiKey, CreatedApiKey } from "@/api/types/apiKey";
import type { PaginationData } from "@/app/api/response";
import type { ListApiKeysParams, CreateApiKeyParams } from "@/app/api/admin/api-keys/schema";

export const apiKeysApi = {
  listApiKeys(params?: ListApiKeysParams): Promise<{ data: ApiKey[]; pagination: PaginationData }> {
    return apiClient.getPaginated<ApiKey>("/admin/api-keys", params);
  },

  createApiKey(params: CreateApiKeyParams): Promise<CreatedApiKey> {
    return apiClient.post<CreatedApiKey>("/admin/api-keys", params);
  },

  deleteApiKey(id: string): Promise<void> {
    return apiClient.delete(`/admin/api-keys/${id}`);
  },
};
