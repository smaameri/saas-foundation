import { apiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { Organization } from "@/services/api/types/organization";
import type { PaginationData } from "@/app/api/response";

export const organizationsApi = {
  listOrganizations(
    params?: ListParams,
  ): Promise<{ data: Organization[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Organization>("/admin/organizations", params);
  },
};
