import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function listApiKeys(params: {
  enabled?: string[];
  search?: string;
  sort?: string;
  order?: SortOrder;
  page: number;
  perPage: number;
}) {
  const { page, perPage } = params;
  const where = {
    ...enabledFilter(params.enabled),
    ...searchFilter(params.search),
  };

  const [data, total] = await prisma.$transaction([
    prisma.apikey.findMany({
      where,
      include: { user: true },
      orderBy: { [params.sort ?? "createdAt"]: params.order ?? "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.apikey.count({ where }),
  ]);

  return { data, total };
}

export async function listApiKeysForUser(params: {
  userId: string;
  enabled?: string[];
  search?: string;
  sort?: string;
  order?: SortOrder;
  page: number;
  perPage: number;
}) {
  const { userId, page, perPage } = params;
  const where = {
    referenceId: userId,
    ...enabledFilter(params.enabled),
    ...searchFilter(params.search),
  };

  const [data, total] = await prisma.$transaction([
    prisma.apikey.findMany({
      where,
      include: { user: true },
      orderBy: { [params.sort ?? "createdAt"]: params.order ?? "desc" },
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
