import { apiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { ApiKey, CreatedApiKey } from "@/services/api/types/apiKey";
import type { CreateApiKeyBody } from "@/app/api/admin/api-keys/schema";
import type { PaginationData } from "@/app/api/response";

export const accountApiKeysApi = {
  listApiKeys(params?: ListParams): Promise<{ data: ApiKey[]; pagination: PaginationData }> {
    return apiClient.getPaginated<ApiKey>("/admin/account/api-keys", params);
  },

  createApiKey(params: CreateApiKeyBody): Promise<CreatedApiKey> {
    return apiClient.post<CreatedApiKey>("/admin/account/api-keys", params);
  },

  updateApiKey(id: string, body: { name: string }): Promise<ApiKey> {
    return apiClient.patch<ApiKey>(`/admin/account/api-keys/${id}`, body);
  },

  deleteApiKey(id: string) {
    return apiClient.delete(`/admin/account/api-keys/${id}`);
  },
};
