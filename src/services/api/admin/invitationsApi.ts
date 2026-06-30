import {apiClient} from "@/services/api/client";

type SendInvitationParams = {
  email: string;
  role: string;
};

export const invitationsApi = {
  sendInvitation(organizationId: string, params: SendInvitationParams) {
    return apiClient.post(`/admin/organizations/${organizationId}/invitations`, params);
  },

  cancelInvitation(invitationId: string) {
    return apiClient.delete(`/admin/invitations/${invitationId}`);
  },
};
