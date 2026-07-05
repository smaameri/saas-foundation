import { apiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import type { ListCustomerUsersParams } from "@/app/api/admin/customer-users/schema";
import type { PaginationData } from "@/app/api/response";

type Organization = { id: string; name: string };

export const customerUsersApi = {
  listCustomerUsers(
    params?: ListCustomerUsersParams,
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/customer-users", params);
  },

  listOrganizations(): Promise<Organization[]> {
    return apiClient.get<Organization[]>("/admin/organizations");
  },
};
