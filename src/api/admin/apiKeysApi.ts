import { apiClient } from "@/api/client";
import type { ApiKey, CreatedApiKey } from "@/api/types/apiKey";
import type { ListApiKeysParams, CreateApiKeyParams } from "@/app/api/admin/api-keys/schema";

export const apiKeysApi = {
  listApiKeys(params?: ListApiKeysParams): Promise<ApiKey[]> {
    return apiClient.get<ApiKey[]>("/admin/api-keys", params);
  },

  createApiKey(params: CreateApiKeyParams): Promise<CreatedApiKey> {
    return apiClient.post<CreatedApiKey>("/admin/api-keys", params);
  },

  deleteApiKey(id: string): Promise<void> {
    return apiClient.delete(`/admin/api-keys/${id}`);
  },
};
