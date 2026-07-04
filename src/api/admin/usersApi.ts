import { apiClient } from "@/api/client";
import type { User } from "@/api/types/user";
import type { PaginationData } from "@/app/api/response";
import type { ListUsersParams } from "@/app/api/admin/users/schema";

export const usersApi = {
  listUsers(params?: ListUsersParams): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/users", params);
  },
};
