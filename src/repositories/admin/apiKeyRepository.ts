import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function listApiKeys(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const [data, total] = await prisma.$transaction([
    prisma.apikey.findMany({
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.apikey.count(),
  ]);

  return { data, total };
}
