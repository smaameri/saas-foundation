import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";
import { Portal } from "@/config/portals";

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

export async function listAdminPortalInvitations(params?: {
  organizationId?: string | null;
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
  status?: string[];
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = {
    portal: Portal.admin,
    organizationId: params?.organizationId ?? null,
    ...(params?.status?.length ? { status: { in: params.status } } : {}),
  };

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

export async function listOrganizationInvitations(
  organizationId: string,
  params?: {
    sort?: string;
    order?: SortOrder;
    page?: number;
    perPage?: number;
    status?: string[];
  },
) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = {
    organizationId,
    ...(params?.status?.length ? { status: { in: params.status } } : {}),
  };

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

export async function createAdminPortalInvitation(params: {
  email: string;
  role: string;
  inviterId: string;
  expiresAt: Date;
}) {
  const { email, role, inviterId, expiresAt } = params;

  return prisma.invitation.create({
    data: {
      id: crypto.randomUUID(),
      email,
      role,
      portal: Portal.admin,
      organizationId: null,
      status: "pending",
      inviterId,
      expiresAt,
    },
  });
}
