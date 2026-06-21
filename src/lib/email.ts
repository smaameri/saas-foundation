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

  const inviter = invitedBy ? ` by ${invitedBy}` : "";
  // Replace with your real email provider integration.
  // For now we log to the console so you can copy the link manually in development.
  console.info(
    `\n[Invite email]\nTo: ${email}\nRole: ${role}\nInvited${inviter}\nLink: ${link}\n`
  );
}
