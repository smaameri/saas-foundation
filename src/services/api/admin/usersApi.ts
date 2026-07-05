import { apiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import type { ListUsersParams } from "@/app/api/admin/users/schema";
import type { PaginationData } from "@/app/api/response";

export const usersApi = {
  listUsers(params?: ListUsersParams): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/users", params);
  },
};
