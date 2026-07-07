import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function listApiKeys(params?: {
  search?: string;
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
  enabled?: string[];
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const enabledFilter = params?.enabled;
  const enabledWhere =
    enabledFilter && enabledFilter.length === 1
      ? { enabled: enabledFilter[0] === "true" }
      : undefined;

  const searchWhere = params?.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" as const } },
          { start: { contains: params.search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const where = { ...enabledWhere, ...searchWhere };

  const [data, total] = await prisma.$transaction([
    prisma.apikey.findMany({
      where,
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.apikey.count({ where }),
  ]);

  return { data, total };
}
