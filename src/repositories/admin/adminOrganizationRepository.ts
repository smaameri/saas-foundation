import { Portal } from "@/config/portals";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function findAdminOrganization() {
  return prisma.organization.findFirst({
    where: { portals: { has: Portal.admin } },
  });
}

export async function listAdminUsers(params?: { sort?: string; order?: SortOrder }) {
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
    orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "asc" },
  });
}

export async function listAdminInvitations(params?: { sort?: string; order?: SortOrder }) {
  return prisma.invitation.findMany({
    where: { organization: { portals: { has: Portal.admin } } },
    orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
  });
}
