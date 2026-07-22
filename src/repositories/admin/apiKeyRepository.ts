import { prisma } from "@/lib/prisma";
import type { BaseListParams, SortOrder } from "@/repositories/types";

type SortField = "name" | "createdAt" | "expiresAt";

type Filters = {
  enabled?: string[];
  search?: string;
  users?: string[];
};

export type ListApiKeysParams = {
  params: BaseListParams<SortField>;
  filters?: Filters;
};

export async function listApiKeys({ params, filters }: ListApiKeysParams) {
  const { page, perPage, sort, order } = params;
  const { enabled, search, users } = filters ?? {};
  const where = {
    ...enabledFilter(enabled),
    ...searchFilter(search),
    ...usersFilter(users),
  };

  const [data, total] = await prisma.$transaction([
    prisma.apikey.findMany({
      where,
      include: { user: true },
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.apikey.count({ where }),
  ]);

  return { data, total };
}

export async function findApiKeyById(id: string) {
  return prisma.apikey.findUnique({ where: { id } });
}

export async function disableApiKeyById(id: string) {
  return prisma.apikey.update({
    where: { id },
    data: { enabled: false },
  });
}

function enabledFilter(enabled?: string[]) {
  const hasTrue = enabled?.includes("true") ?? false;
  const hasFalse = enabled?.includes("false") ?? false;

  if (hasTrue && !hasFalse) return { enabled: true };
  if (hasFalse && !hasTrue) return { enabled: false };
  return undefined;
}

function searchFilter(search?: string) {
  if (!search) return undefined;
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { start: { contains: search, mode: "insensitive" as const } },
    ],
  };
}

function usersFilter(users?: string[]) {
  if (!users?.length) return undefined;
  if (users.length === 1) return { referenceId: users[0] };
  return { referenceId: { in: users } };
}

function buildOrderBy(sort: SortField | undefined, order: SortOrder | undefined) {
  return { [sort ?? "createdAt"]: order ?? "desc" } as const;
}
