import { EMAIL_FROM, getResend } from "@/lib/email/client";
import { appConfig } from "@/config/app";

export type MagicLinkInvitePayload = {
  email: string;
  link: string;
  invitedBy?: string;
  role: string;
};

export async function sendMagicLinkInviteEmail({
  email,
  link,
  invitedBy,
  role,
}: MagicLinkInvitePayload) {
  if (!email || !link) {
    throw new Error("Magic link email requires both email and link.");
  }

  const inviterText = invitedBy ? `invited by ${invitedBy}` : "invited";
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const { error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `You've been invited to ${appConfig.name}`,
    html: `
      <p>You've been ${inviterText} to join ${appConfig.name} as <strong>${capitalizedRole}</strong>.</p>
      <p>Click the link below to accept your invitation and set up your account. This link is single-use and will expire shortly.</p>
      <p><a href="${link}">Accept invitation</a></p>
      <p>If you weren't expecting this email, you can safely ignore it.</p>
    `,
  });

  if (error) {
    console.error("[Resend] Failed to send invite email:", error);
    throw new Error(error.message);
  }
}
