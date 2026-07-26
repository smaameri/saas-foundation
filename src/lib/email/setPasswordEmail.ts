import { EMAIL_FROM, getResend } from "@/lib/email/client";

export type SetPasswordInvitePayload = {
  email: string;
  url: string;
};

export async function sendSetPasswordInviteEmail({ email, url }: SetPasswordInvitePayload) {
  if (!email || !url) {
    throw new Error("Set password invite email requires both email and url.");
  }

  const { error } = await getResend().emails.send({
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
