import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function findById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
}

export async function listOrganizations(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = {};
  const select = {
    id: true,
    name: true,
    createdAt: true,
    _count: { select: { members: true } },
  };

  const [data, total] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      select,
      orderBy: { [params?.sort ?? "name"]: params?.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.organization.count({ where }),
  ]);

  return { data, total };
}
