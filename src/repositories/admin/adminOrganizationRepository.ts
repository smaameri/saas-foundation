import { Portal } from "@/config/portals";
import { prisma } from "@/lib/prisma";

export async function findAdminOrganization() {
  return prisma.organization.findFirst({
    where: { portals: { has: Portal.admin } },
  });
}

export async function listAdminUsers() {
  return prisma.user.findMany({
    where: {
      members: {
        some: {
          organization: { portals: { has: Portal.admin } },
        },
      },
    },
    include: {
      members: {
        include: { organization: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function listAdminInvitations() {
  return prisma.invitation.findMany({
    where: { organization: { portals: { has: Portal.admin } } },
    orderBy: { createdAt: "desc" },
  });
}
