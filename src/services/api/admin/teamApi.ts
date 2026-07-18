import { adminApiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import type { CreateAdminPortalInvitationBody } from "@/app/api/admin/team/invitations/schema";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";
import type { PaginationData } from "@/app/api/response";

export const teamApi = {
  listTeamMembers(
    params?: ListTeamMembersParams & { filters?: Record<string, string[]> },
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<User>("/team", params);
  },

  inviteMember(body: CreateAdminPortalInvitationBody): Promise<{
    message: string;
    invitationId: string;
  }> {
    return adminApiClient.post<{ message: string; invitationId: string }>(
      "/admin/team/invitations",
      body,
    );
  },

  deleteUser(id: string): Promise<void> {
    return adminApiClient.delete(`/team/${id}`);
  },

  changeRole(id: string, role: "admin" | "user"): Promise<User> {
    return adminApiClient.patch<User>(`/team/${id}/role`, { role });
  },

  banUser(id: string, body: { banReason?: string; banExpiresIn?: number }): Promise<User> {
    return adminApiClient.post<User>(`/team/${id}/ban`, body);
  },

  unbanUser(id: string): Promise<User> {
    return adminApiClient.post<User>(`/team/${id}/unban`, {});
  },
};
