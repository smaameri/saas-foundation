import { apiClient } from "@/services/api/client";
import type { Invitation } from "@/services/api/types/invitation";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";
import type { ListAdminPortalInvitationsParams } from "@/app/api/admin/team/invitations/schema";
import type { PaginationData } from "@/app/api/response";

type SendInvitationParams = {
  email: string;
  role: string;
  platformRole: string;
};

export const invitationsApi = {
  listInvitations(
    params?: ListInvitationsParams,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Invitation>("/admin/invitations", params);
  },

  listAdminPortalInvitations(
    params?: ListAdminPortalInvitationsParams,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Invitation>("/admin/team/invitations", {
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: params?.status && params.status.length > 0 ? { status: params.status } : undefined,
    });
  },

  sendInvitation(organizationId: string, params: SendInvitationParams) {
    return apiClient.post(`/admin/organizations/${organizationId}/invitations`, params);
  },

  cancelInvitation(invitationId: string) {
    return apiClient.delete(`/admin/invitations/${invitationId}`);
  },

  cancelAdminTeamInvitation(invitationId: string) {
    return apiClient.delete(`/admin/team/invitations/${invitationId}`);
  },
};
