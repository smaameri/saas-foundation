import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function findMemberByUserId(userId: string) {
  return prisma.member.findFirst({
    where: { userId },
  });
}

export async function findMemberById(id: string, organizationId: string) {
  return prisma.member.findFirst({
    where: { id, organizationId },
    include: { user: true },
  });
}

export async function updateMember(
  id: string,
  organizationId: string,
  params: {
    role: string;
    platformRole: string;
    firstName?: string | null;
    lastName?: string | null;
  },
) {
  const member = await prisma.member.update({
    where: { id, organizationId },
    data: { role: params.role },
    include: { user: true },
  });

  await prisma.user.update({
    where: { id: member.userId },
    data: {
      role: params.platformRole,
      firstName: params.firstName,
      lastName: params.lastName,
    },
  });

  return findMemberById(id, organizationId);
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
