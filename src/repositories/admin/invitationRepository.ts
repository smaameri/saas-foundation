import { prisma } from "@/lib/prisma";

export async function findPendingInvitation(email: string, organizationId: string) {
  return prisma.invitation.findFirst({
    where: { email, organizationId, status: "pending" },
  });
}

export async function findInvitationById(id: string) {
  return prisma.invitation.findUnique({
    where: { id },
  });
}

export async function cancelInvitation(id: string) {
  return prisma.invitation.update({
    where: { id },
    data: { status: "canceled" },
  });
}
