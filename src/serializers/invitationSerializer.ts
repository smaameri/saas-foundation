import type { Invitation } from "@/services/api/types/invitation";
import type { listAdminInvitations } from "@/repositories/admin/adminOrganizationRepository";

type PrismaInvitation = Awaited<ReturnType<typeof listAdminInvitations>>["data"][number];

export function serializeInvitation(invitation: PrismaInvitation): Invitation {
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    createdAt: invitation.createdAt.toISOString(),
    expiresAt: invitation.expiresAt.toISOString(),
  };
}
