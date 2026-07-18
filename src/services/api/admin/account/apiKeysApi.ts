import { adminApiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { ApiKey, CreatedApiKey } from "@/services/api/types/apiKey";
import type { CreateApiKeyBody } from "@/app/api/admin/api-keys/schema";
import type { PaginationData } from "@/app/api/response";

export const accountApiKeysApi = {
  listApiKeys(params?: ListParams): Promise<{ data: ApiKey[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<ApiKey>("/account/api-keys", params);
  },

  createApiKey(params: CreateApiKeyBody): Promise<CreatedApiKey> {
    return adminApiClient.post<CreatedApiKey>("/account/api-keys", params);
  },

  updateApiKey(id: string, body: { name: string }): Promise<ApiKey> {
    return adminApiClient.patch<ApiKey>(`/account/api-keys/${id}`, body);
  },

  deleteApiKey(id: string) {
    return adminApiClient.delete(`/account/api-keys/${id}`);
  },
};
