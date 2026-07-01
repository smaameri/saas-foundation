import { apiClient } from "@/api/client";
import type { User } from "@/api/types/user";
import type { ListUsersParams } from "@/app/api/admin/users/schema";

export const usersApi = {
  listUsers(params?: ListUsersParams): Promise<User[]> {
    return apiClient.get<User[]>("/admin/users", params);
  },
};
