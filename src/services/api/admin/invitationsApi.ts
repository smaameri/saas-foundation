import { apiClient } from "@/services/api/client";
import type { Invitation } from "@/services/api/types/invitation";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";
import type { PaginationData } from "@/app/api/response";

type SendInvitationParams = {
  email: string;
  role: string;
};

export const invitationsApi = {
  listInvitations(
    params?: ListInvitationsParams,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Invitation>("/admin/invitations", params);
  },

  sendInvitation(organizationId: string, params: SendInvitationParams) {
    return apiClient.post(`/admin/organizations/${organizationId}/invitations`, params);
  },

  cancelInvitation(invitationId: string) {
    return apiClient.delete(`/admin/invitations/${invitationId}`);
  },
};
