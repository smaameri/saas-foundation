import type { Prisma } from "@generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BaseListParams, SortOrder } from "@/repositories/types";
import { combineFilters } from "@/repositories/utils";

type MemberSortField = "createdAt" | "firstName" | "lastName" | "email" | "role" | "name";

type MemberFilters = {
  organizations?: string[];
  status?: string[];
  search?: string;
  roles?: string[];
};

export type ListMembersParams = {
  params: BaseListParams<MemberSortField>;
  filters?: MemberFilters;
};

export async function listMembers({ params, filters }: ListMembersParams) {
  const { page, perPage, sort, order } = params;
  const { organizations, status, search, roles } = filters ?? {};
  const where = combineFilters<Prisma.MemberWhereInput>(
    organizationsFilter(organizations),
    statusFilter(status),
    rolesFilter(roles),
    searchFilter(search),
  );

  const [data, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: { user: true },
      orderBy: buildOrderBy(sort, order),
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

function organizationsFilter(organizations?: string[]): Prisma.MemberWhereInput | undefined {
  const unique = Array.from(new Set((organizations ?? []).filter(Boolean)));
  if (unique.length === 0) return undefined;
  if (unique.length === 1) return { organizationId: unique[0] };
  return { organizationId: { in: unique } };
}

function statusFilter(status?: string[]): Prisma.MemberWhereInput | undefined {
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

function rolesFilter(roles?: string[]): Prisma.MemberWhereInput | undefined {
  if (!roles?.length) return undefined;

  const normalized = Array.from(
    new Set(roles.map((value) => value.trim().toLowerCase()).filter(Boolean)),
  );

  if (normalized.length === 0) return undefined;

  if (normalized.length === 1) {
    return { role: normalized[0] };
  }

  return { role: { in: normalized } };
}

function searchFilter(search?: string): Prisma.MemberWhereInput | undefined {
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
  sort: MemberSortField | undefined,
  order: SortOrder | undefined,
): Prisma.MemberOrderByWithRelationInput {
  const direction = order ?? "desc";

  switch (sort) {
    case "firstName":
      return { user: { firstName: direction } };
    case "lastName":
      return { user: { lastName: direction } };
    case "email":
      return { user: { email: direction } };
    case "role":
      return { role: direction };
    case "name":
      return { user: { name: direction } };
    default:
      return { createdAt: direction };
  }
}
