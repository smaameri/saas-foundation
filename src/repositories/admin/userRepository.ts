import type { Prisma } from "@generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BaseListParams, SortOrder } from "@/repositories/types";
import { combineFilters } from "@/repositories/utils";

type UserSortField = "name" | "email" | "createdAt";

type UserFilters = {
  search?: string;
  status?: string[];
};

export type ListUsersOptions = {
  params: BaseListParams<UserSortField>;
  filters?: UserFilters;
};

export async function updateUser(id: string, data: { firstName: string; lastName: string }) {
  return prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
    },
  });
}

export async function listUsers({ params, filters }: ListUsersOptions) {
  const { page, perPage, sort, order } = params;
  const where = combineFilters<Prisma.UserWhereInput>(
    searchFilter(filters?.search),
    statusFilter(filters?.status),
  );

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}

export async function deleteUser(id: string) {
  const { count } = await prisma.user.deleteMany({ where: { id } });
  return count > 0;
}

function searchFilter(search?: string): Prisma.UserWhereInput | undefined {
  const term = search?.trim();
  if (!term) return undefined;

  return {
    OR: [
      { name: { contains: term, mode: "insensitive" } },
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
    ],
  };
}

function statusFilter(statuses?: string[]): Prisma.UserWhereInput | undefined {
  if (!statuses?.length) return undefined;

  const normalized = Array.from(
    new Set(statuses.map((value) => value.trim().toLowerCase()).filter(Boolean)),
  );

  if (normalized.length !== 1) return undefined;
  return normalized[0] === "banned"
    ? { banned: true }
    : normalized[0] === "active"
      ? { OR: [{ banned: false }, { banned: null }] }
      : undefined;
}

function buildOrderBy(sort: UserSortField | undefined, order: SortOrder | undefined) {
  return { [sort ?? "createdAt"]: order ?? "desc" } as const;
}
