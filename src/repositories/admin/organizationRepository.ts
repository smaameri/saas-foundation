import { prisma } from "@/lib/prisma";

export async function findById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
  });
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    where: { portals: { has: "customer" } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      portals: true,
      createdAt: true,
      _count: { select: { members: true } },
    },
  });
}
