import { apiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import type { CreateAdminPortalInvitationBody } from "@/app/api/admin/team/invitations/schema";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";
import type { PaginationData } from "@/app/api/response";

export const teamApi = {
  listTeamMembers(
    params?: ListTeamMembersParams,
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/team", params);
  },

  inviteMember(body: CreateAdminPortalInvitationBody): Promise<{
    message: string;
    invitationId: string;
  }> {
    return apiClient.post<{ message: string; invitationId: string }>(
      "/admin/team/invitations",
      body,
    );
  },

  deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/admin/team/${id}`);
  },

  changeRole(id: string, role: "admin" | "user"): Promise<User> {
    return apiClient.patch<User>(`/admin/team/${id}/role`, { role });
  },
};
