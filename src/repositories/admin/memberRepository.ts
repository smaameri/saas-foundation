import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function findMemberByUserId(userId: string) {
  return prisma.member.findFirst({
    where: { userId },
  });
}

export async function listMembers(
  organizationId: string,
  params: {
    sort?: string;
    order?: SortOrder;
    page: number;
    perPage: number;
  },
) {
  const { page, perPage } = params;
  const where = { organizationId };

  const [data, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: { user: true },
      orderBy: { [params.sort ?? "createdAt"]: params.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.member.count({ where }),
  ]);

  return { data, total };
}
