import { prisma } from "@/lib/prisma";
import { Portal } from "@/config/portals";

export async function findAdminInvitationById(id: string) {
  return prisma.invitation.findFirst({
    where: {
      id,
      portal: Portal.admin,
    },
  });
}

export async function markInvitationAccepted(id: string) {
  return prisma.invitation.update({
    where: { id },
    data: { status: "accepted" },
  });
}
