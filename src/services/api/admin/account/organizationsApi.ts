import { adminApiClient } from "@/services/api/client";
import type { UserOrganizationSummary } from "@/services/api/types/organization";

export const accountOrganizationsApi = {
  listOrganizationsForCurrentUser(): Promise<UserOrganizationSummary[]> {
    return adminApiClient.get<UserOrganizationSummary[]>("/account/organizations");
  },
};
