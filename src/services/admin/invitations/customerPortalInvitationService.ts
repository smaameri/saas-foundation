import { sendOrganizationInvitationEmail } from "@/lib/email";
import { createCustomerPortalInvitation } from "@/repositories/admin/invitationRepository";

const INVITATION_EXPIRES_IN_DAYS = 2;

type SendCustomerPortalInvitationParams = {
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
  inviterId: string;
  inviterName: string;
};

export async function sendCustomerPortalInvitation({
  email,
  role,
  organizationId,
  organizationName,
  inviterId,
  inviterName,
}: SendCustomerPortalInvitationParams) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRES_IN_DAYS);

  const invitation = await createCustomerPortalInvitation({
    email,
    role,
    organizationId,
    inviterId,
    expiresAt,
  });

  await sendOrganizationInvitationEmail({
    email,
    organizationName,
    invitedBy: inviterName,
    inviteLink: `${process.env.APP_URL}/accept-invitation/customer-portal/${invitation.id}`,
  });

  return invitation;
}
