"use server";

import {z} from "zod";

import {sendOrganizationInvitationEmail} from "@/lib/email";
import {prisma} from "@/lib/prisma";
import {fetchSession} from "@/lib/session";

const inviteSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
  organizationId: z.string().min(1, "Organization is required"),
});

const INVITATION_EXPIRES_IN_DAYS = 2;

export async function inviteOrganizationUser(formData: FormData) {
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
    organizationId: formData.get("organizationId"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const {email, role, organizationId} = parsed.data;

  const session = await fetchSession();
  if (!session?.user) {
    return {ok: false, message: "Unauthorized."};
  }

  try {
    const org = await prisma.organization.findUnique({
      where: {id: organizationId},
      select: {name: true},
    });

    if (!org) {
      return {ok: false, message: "Organization not found."};
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRES_IN_DAYS);

    const invitation = await prisma.invitation.create({
      data: {
        id: crypto.randomUUID(),
        email,
        role,
        status: "pending",
        organizationId,
        inviterId: session.user.id,
        expiresAt,
      },
    });

    const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${invitation.id}`;

    await sendOrganizationInvitationEmail({
      email,
      organizationName: org.name,
      invitedBy: session.user.name,
      inviteLink,
    });

    return {ok: true, message: `Invitation sent to ${email}.`};
  } catch (error) {
    console.error("Failed to send invite", error);
    const message = error instanceof Error ? error.message : "Failed to send invite. Please try again.";
    return {ok: false, message};
  }
}
