import { adminApiClient } from "@/services/api/client";
import type { ListUsersParams } from "@/app/api/admin/users/schema";
import type { PaginationData } from "@/app/api/response";
import type { User } from "@/types/user";

export const usersApi = {
  listUsers(
    params?: ListUsersParams & { filters?: Record<string, string[]> },
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<User>("/users", params);
  },

  deleteUser(id: string): Promise<void> {
    return adminApiClient.delete(`/users/${id}`);
  },

  banUser(id: string, body: { banReason?: string; banExpiresIn?: number }): Promise<User> {
    return adminApiClient.post<User>(`/users/${id}/ban`, body);
  },

  unbanUser(id: string): Promise<User> {
    return adminApiClient.post<User>(`/users/${id}/unban`, {});
  },
};
