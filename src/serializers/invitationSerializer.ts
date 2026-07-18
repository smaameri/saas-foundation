import type { Invitation as PrismaInvitation } from "@generated/prisma/client";
import type { Invitation } from "@/types/invitation";

export function serializeInvitation(invitation: PrismaInvitation): Invitation {
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    portal: invitation.portal,
    status: invitation.status,
    createdAt: invitation.createdAt.toISOString(),
    expiresAt: invitation.expiresAt.toISOString(),
  };
}
