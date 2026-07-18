import { inviteMemberSchema } from "./schema";
import { Resend } from "resend";
import { createAdminPortalInvitation } from "@/repositories/admin/invitationRepository";
import { findUserByEmail } from "@/repositories/admin/teamRepository";
import { withAdmin } from "@/app/api/admin/with-admin";
import { conflictResponse, createdResponse } from "@/app/api/response";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

const INVITATION_EXPIRES_IN_DAYS = 2;

export const POST = withAdmin(async (request, _context, { user }) => {
  const { email, role } = inviteMemberSchema.parse(await request.json());

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return conflictResponse("A user with this email already exists.");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRES_IN_DAYS);

  const invitation = await createAdminPortalInvitation({
    email,
    role,
    inviterId: user.id,
    expiresAt,
  });

  sendAdminPortalInvitationEmail({
    email,
    invitedBy: user.name,
    inviteLink: `${process.env.BETTER_AUTH_URL}/accept-invitation/admin-portal/${invitation.id}`,
  });

  return createdResponse({
    message: `Invitation sent to ${email}.`,
    invitationId: invitation.id,
  });
});

export type AdminPortalInvitationPayload = {
  email: string;
  invitedBy?: string;
  inviteLink: string;
};

export async function sendAdminPortalInvitationEmail({
  email,
  invitedBy,
  inviteLink,
}: AdminPortalInvitationPayload) {
  if (!email || !inviteLink) {
    throw new Error("Organization invitation email requires email and inviteLink.");
  }

  const inviterText = invitedBy ? `${invitedBy} has invited you` : "You've been invited";

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've been invited to join the SaaS Foundation Admin Portal`,
    html: `
      <p>${inviterText} to join the SaaS Foundation Admin Portal.</p>
      <p>Click the link below to accept your invitation.</p>
      <p><a href="${inviteLink}">Accept invitation</a></p>
      <p>If you weren't expecting this email, you can safely ignore it.</p>
    `,
  });

  if (error) {
    console.error("[Resend] Failed to send organization invitation email:", error);
    throw new Error(error.message);
  }
}
