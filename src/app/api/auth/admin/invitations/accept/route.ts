import { acceptAdminInvitationSchema } from "./schema";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  findAdminInvitationById,
  markInvitationAccepted,
} from "@/repositories/auth/invitationRepository";
import { conflictResponse, createdResponse, notFoundResponse } from "@/app/api/response";
import { withErrorHandler } from "@/app/api/with-error-handler";

export const POST = withErrorHandler(async (request) => {
  const validated = acceptAdminInvitationSchema.parse(await request.json());

  const invitation = await findAdminInvitationById(validated.invitationId);
  if (!invitation) {
    return notFoundResponse("Invitation not found.");
  }

  if (invitation.status === "accepted") {
    return conflictResponse("This invitation has already been accepted.");
  }

  if (invitation.status === "canceled") {
    return conflictResponse("This invitation has been canceled.");
  }

  if (invitation.expiresAt < new Date()) {
    return conflictResponse("This invitation has expired.");
  }

  const email = invitation.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return conflictResponse("An account already exists for this email.");
  }

  const trimmedFirstName = validated.firstName.trim();
  const trimmedLastName = validated.lastName.trim();
  const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim();

  try {
    await auth.api.signUpEmail({
      body: {
        name: fullName,
        email,
        password: validated.password,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return conflictResponse(error.body?.message ?? "Unable to complete the invitation.");
    }
    throw error;
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
      name: canonicalName,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      role: invitation.role,
    },
  });

  await markInvitationAccepted(invitation.id);

  return createdResponse({ message: "Invitation accepted." });
});
