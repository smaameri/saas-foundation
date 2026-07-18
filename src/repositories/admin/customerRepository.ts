import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function listCustomerUsers(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const where = {};

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        members: {
          include: { organization: true },
        },
      },
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
