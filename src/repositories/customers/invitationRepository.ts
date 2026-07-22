import { prisma } from "@/lib/prisma";
import { Portal } from "@/config/portals";

export async function findCustomerInvitationById(id: string) {
  return prisma.invitation.findFirst({
    where: {
      id,
      portal: Portal.customer,
    },
    include: {
      organization: true,
    },
  });
}
