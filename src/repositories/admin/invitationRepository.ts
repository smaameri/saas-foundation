import type { Prisma } from "@generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BaseListParams, SortOrder } from "@/repositories/types";
import { combineFilters } from "@/repositories/utils";
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

type InvitationSortField = "email" | "role" | "status" | "createdAt" | "expiresAt";

type StatusFilter = string[] | undefined;

type AdminInvitationFilters = {
  organizationId?: string | null;
  status?: StatusFilter;
};

type CustomerInvitationFilters = {
  organizationIds?: string[];
  status?: StatusFilter;
};

type OrganizationInvitationFilters = {
  status?: StatusFilter;
};

export type ListAdminInvitationsOptions = {
  params: BaseListParams<InvitationSortField>;
  filters?: AdminInvitationFilters;
};

export type ListCustomerInvitationsOptions = {
  params: BaseListParams<InvitationSortField>;
  filters?: CustomerInvitationFilters;
};

export type ListOrganizationInvitationsOptions = {
  params: BaseListParams<InvitationSortField>;
  filters?: OrganizationInvitationFilters;
};

export async function listAdminPortalInvitations({ params, filters }: ListAdminInvitationsOptions) {
  const { page, perPage, sort, order } = params;
  const organizationId = filters?.organizationId ?? null;

  const where = combineFilters<Prisma.InvitationWhereInput>(
    portalFilter(Portal.admin),
    organizationIdFilter(organizationId),
    statusFilter(filters?.status),
  );

  const [data, total] = await prisma.$transaction([
    prisma.invitation.findMany({
      where,
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.invitation.count({ where }),
  ]);

  return { data, total };
}

export async function listCustomerPortalInvitations({
  params,
  filters,
}: ListCustomerInvitationsOptions) {
  const { page, perPage, sort, order } = params;

  const where = combineFilters<Prisma.InvitationWhereInput>(
    portalFilter(Portal.customer),
    organizationIdsFilter(filters?.organizationIds),
    statusFilter(filters?.status),
  );

  const [data, total] = await prisma.$transaction([
    prisma.invitation.findMany({
      where,
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.invitation.count({ where }),
  ]);

  return { data, total };
}

export async function listOrganizationInvitations(
  organizationId: string,
  { params, filters }: ListOrganizationInvitationsOptions,
) {
  const { page, perPage, sort, order } = params;

  const where = combineFilters<Prisma.InvitationWhereInput>(
    organizationIdFilter(organizationId),
    statusFilter(filters?.status),
  );

  const [data, total] = await prisma.$transaction([
    prisma.invitation.findMany({
      where,
      orderBy: buildOrderBy(sort, order),
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

function portalFilter(portal: Portal | undefined): Prisma.InvitationWhereInput | undefined {
  if (!portal) return undefined;
  return { portal };
}

function organizationIdFilter(
  organizationId: string | null | undefined,
): Prisma.InvitationWhereInput | undefined {
  if (organizationId === undefined) return undefined;
  return { organizationId };
}

function organizationIdsFilter(
  organizationIds?: string[],
): Prisma.InvitationWhereInput | undefined {
  if (!organizationIds?.length) return undefined;
  const unique = Array.from(new Set(organizationIds.filter(Boolean)));
  if (unique.length === 0) return undefined;
  if (unique.length === 1) return { organizationId: unique[0] };
  return { organizationId: { in: unique } };
}

function statusFilter(status?: StatusFilter): Prisma.InvitationWhereInput | undefined {
  if (!status?.length) return undefined;
  const values = Array.from(new Set(status.filter(Boolean)));
  if (values.length === 0) return undefined;
  if (values.length === 1) return { status: values[0] };
  return { status: { in: values } };
}

function buildOrderBy(sort: InvitationSortField | undefined, order: SortOrder | undefined) {
  return { [sort ?? "createdAt"]: order ?? "desc" } as const;
}
