import { APIError } from "better-auth";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { markInvitationAccepted } from "@/repositories/auth/invitationRepository";
import { createMember } from "@/repositories/customers/memberRepository";
import { updateUserProfileByEmail } from "@/repositories/customers/userRepository";

export type AcceptCustomerInvitationParams = {
  invitationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
};

export class AcceptCustomerInvitationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AcceptCustomerInvitationError";
  }
}

export async function acceptCustomerInvitation({
  invitationId,
  email,
  password,
  firstName,
  lastName,
  role,
  organizationId,
}: AcceptCustomerInvitationParams) {
  const fullName = `${firstName} ${lastName}`.trim();

  try {
    await auth.api.signUpEmail({
      body: {
        name: fullName,
        email,
        password,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw new AcceptCustomerInvitationError(
        error.body?.message ?? "Unable to complete the invitation.",
      );
    }
    throw error;
  }

  await updateUserProfileByEmail(email, {
    firstName,
    lastName,
    fullName,
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AcceptCustomerInvitationError("User could not be created for this invitation.");
  }

  await createMember({
    userId: user.id,
    organizationId,
    role,
  });

  await markInvitationAccepted(invitationId);

  return { message: "Invitation accepted." };
}
