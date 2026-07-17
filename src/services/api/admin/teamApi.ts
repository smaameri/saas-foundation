import { apiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import type { InviteMemberBody } from "@/app/api/admin/team/invite/schema";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";
import type { PaginationData } from "@/app/api/response";

export const teamApi = {
  listTeamMembers(
    params?: ListTeamMembersParams,
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/team", params);
  },

  inviteMember(body: InviteMemberBody): Promise<User> {
    return apiClient.post<User>("/admin/team/invite", body);
  },

  deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/admin/team/${id}`);
  },

  changeRole(id: string, role: "admin" | "user"): Promise<User> {
    return apiClient.patch<User>(`/admin/team/${id}/role`, { role });
  },
};
