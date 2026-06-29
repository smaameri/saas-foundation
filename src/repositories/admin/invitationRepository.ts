import { prisma } from "@/lib/prisma";

export async function findPendingInvitation(email: string, organizationId: string) {
  return prisma.invitation.findFirst({
    where: { email, organizationId, status: "pending" },
  });
}
