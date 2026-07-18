import { EMAIL_FROM, resend } from "./client";

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

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "You've been invited to SaaS Foundation",
    html: `
      <p>You've been ${inviterText} to join SaaS Foundation as <strong>${capitalizedRole}</strong>.</p>
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

export type SetPasswordInvitePayload = {
  email: string;
  url: string;
};

export async function sendSetPasswordInviteEmail({ email, url }: SetPasswordInvitePayload) {
  if (!email || !url) {
    throw new Error("Set password invite email requires both email and url.");
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "You've been invited to SaaS Foundation",
    html: `
      <p>You've been invited to join the <strong>SaaS Foundation</strong> admin portal.</p>
      <p>Click the link below to set your password and get started. This link is single-use and will expire shortly.</p>
      <p><a href="${url}">Set your password</a></p>
      <p>If you weren't expecting this email, you can safely ignore it.</p>
    `,
  });

  if (error) {
    console.error("[Resend] Failed to send set password invite email:", error);
    throw new Error(error.message);
  }
}

export type OrganizationInvitationPayload = {
  email: string;
  organizationName: string;
  invitedBy?: string;
  inviteLink: string;
};

export async function sendOrganizationInvitationEmail({
  email,
  organizationName,
  invitedBy,
  inviteLink,
}: OrganizationInvitationPayload) {
  if (!email || !inviteLink) {
    throw new Error("Organization invitation email requires email and inviteLink.");
  }

  const inviterText = invitedBy ? `${invitedBy} has invited you` : "You've been invited";

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `You've been invited to join ${organizationName}`,
    html: `
      <p>${inviterText} to join <strong>${organizationName}</strong>.</p>
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
