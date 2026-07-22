import { sendOrganizationInvitationEmail } from "@/lib/email";
import { createCustomerPortalInvitation } from "@/repositories/admin/invitationRepository";

const INVITATION_EXPIRES_IN_DAYS = 2;

type SendInvitationParams = {
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
  inviterId: string;
  inviterName: string;
};

export async function sendInvitation({
  email,
  role,
  organizationId,
  organizationName,
  inviterId,
  inviterName,
}: SendInvitationParams) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRES_IN_DAYS);

  const invitation = await createCustomerPortalInvitation({
    email,
    role,
    organizationId,
    inviterId,
    expiresAt,
  });

  const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/customer-portal/${invitation.id}`;

  await sendOrganizationInvitationEmail({
    email,
    organizationName,
    invitedBy: inviterName,
    inviteLink,
  });

  return invitation;
}
