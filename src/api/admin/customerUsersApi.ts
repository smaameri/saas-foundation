import { apiClient } from "@/api/client";
import type { User } from "@/api/types/user";
import type { PaginationData } from "@/app/api/response";
import type { ListCustomerUsersParams } from "@/app/api/admin/customer-users/schema";

type Organization = { id: string; name: string };

export const customerUsersApi = {
  listCustomerUsers(params?: ListCustomerUsersParams): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/customer-users", params);
  },

  listOrganizations(): Promise<Organization[]> {
    return apiClient.get<Organization[]>("/admin/organizations");
  },
};
