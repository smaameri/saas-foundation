import type { Prisma } from "@generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListOrganizationMembersParams } from "@/app/api/admin/members/schema";

export async function listOrganizationMembers(
  organizationId?: string,
  params?: ListOrganizationMembersParams,
) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const organizationIds = Array.from(
    new Set(
      [...(organizationId ? [organizationId] : []), ...(params?.organizationIds ?? [])].filter(
        Boolean,
      ),
    ),
  ) as string[];

  const where: Prisma.MemberWhereInput = {};

  if (organizationIds.length === 1) {
    where.organizationId = organizationIds[0];
  } else if (organizationIds.length > 1) {
    where.organizationId = { in: organizationIds };
  }

  const filters: Prisma.MemberWhereInput[] = [];
  const statusFilter = buildStatusFilter(params?.status);
  if (statusFilter) filters.push(statusFilter);

  const searchFilter = buildSearchFilter(params?.search);
  if (searchFilter) filters.push(searchFilter);

  if (filters.length > 0) {
    where.AND = where.AND
      ? [...(Array.isArray(where.AND) ? where.AND : [where.AND]), ...filters]
      : filters;
  }

  const orderBy = buildOrderBy(params?.sort, params?.order);

  const [data, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: { user: true },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.member.count({ where }),
  ]);

  return { data, total };
}

export async function findMember(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function updateMember(id: string, params: { role: string }) {
  return prisma.member.update({
    where: { id },
    data: { role: params.role },
    include: { user: true },
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}

function buildStatusFilter(status?: string[]): Prisma.MemberWhereInput | undefined {
  if (!status?.length) return undefined;

  const normalized = Array.from(
    new Set(status.map((value) => value.trim().toLowerCase()).filter(Boolean)),
  );
  if (normalized.length === 0) return undefined;

  const hasBanned = normalized.includes("banned");
  const hasActive = normalized.includes("active");

  if (hasBanned && hasActive) return undefined;

  if (hasBanned) {
    return { user: { is: { banned: true } } };
  }

  if (hasActive) {
    return { user: { is: { OR: [{ banned: false }, { banned: null }] } } };
  }

  return undefined;
}

function buildSearchFilter(search?: string): Prisma.MemberWhereInput | undefined {
  const term = search?.trim();
  if (!term) return undefined;

  return {
    OR: [
      { role: { contains: term, mode: "insensitive" } },
      {
        user: {
          is: {
            OR: [
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
              { name: { contains: term, mode: "insensitive" } },
              { email: { contains: term, mode: "insensitive" } },
            ],
          },
        },
      },
    ],
  };
}

function buildOrderBy(
  sort: ListOrganizationMembersParams["sort"],
  order: ListOrganizationMembersParams["order"],
): Prisma.MemberOrderByWithRelationInput {
  const direction = order ?? "desc";

  switch (sort) {
    case "firstName":
      return { user: { firstName: direction } };
    case "lastName":
      return { user: { lastName: direction } };
    case "email":
      return { user: { email: direction } };
    default:
      return { createdAt: direction };
  }
}
