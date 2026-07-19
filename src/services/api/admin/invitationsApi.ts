import { adminApiClient } from "@/services/api/client";
import type { ListInvitationsParams } from "@/app/api/admin/organizations/invitations/schema";
import type { ListAdminPortalInvitationsParams } from "@/app/api/admin/team/invitations/schema";
import type { PaginationData } from "@/app/api/response";
import type { Invitation } from "@/types/invitation";

type SendInvitationParams = {
  email: string;
  role: string;
  platformRole: string;
};

export const invitationsApi = {
  listInvitations(
    params?: ListInvitationsParams,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<Invitation>("/invitations", params);
  },

  listAdminPortalInvitations(
    params?: ListAdminPortalInvitationsParams,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<Invitation>("/team/invitations", {
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: params?.status && params.status.length > 0 ? { status: params.status } : undefined,
    });
  },

  sendInvitation(organizationId: string, params: SendInvitationParams) {
    return adminApiClient.post(`/organizations/${organizationId}/invitations`, params);
  },

  cancelInvitation(invitationId: string) {
    return adminApiClient.delete(`/invitations/${invitationId}`);
  },

  cancelAdminTeamInvitation(invitationId: string) {
    return adminApiClient.delete(`/team/invitations/${invitationId}`);
  },
};
