import { Portal } from "@/config/portals";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function findAdminOrganization() {
  return prisma.organization.findFirst({
    where: { portals: { has: Portal.admin } },
  });
}

export async function listAdminUsers(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = {
    members: {
      some: {
        organization: { portals: { has: Portal.admin } },
      },
    },
  };

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        members: {
          include: { organization: true },
        },
      },
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}

export async function listAdminInvitations(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = { organization: { portals: { has: Portal.admin } } };

  const [data, total] = await prisma.$transaction([
    prisma.invitation.findMany({
      where,
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.invitation.count({ where }),
  ]);

  return { data, total };
}
