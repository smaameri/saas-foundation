import type { Prisma } from "@generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

function whereHasAdminPortalAccess(): Prisma.UserWhereInput {
  return { role: { not: null } };
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateTeamMemberRole(id: string, role: string) {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
}

export async function listTeamMembers(params: {
  sort?: string;
  order?: SortOrder;
  page: number;
  perPage: number;
}) {
  const { page, perPage } = params;
  const where = whereHasAdminPortalAccess();

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { [params.sort ?? "createdAt"]: params.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}
