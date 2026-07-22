import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function createMember({
  userId,
  organizationId,
  role,
}: {
  userId: string;
  organizationId: string;
  role: string;
}) {
  return prisma.member.create({
    data: {
      id: randomUUID(),
      userId,
      organizationId,
      role,
    },
  });
}

export async function findMemberByOrganizationAndUser(organizationId: string, userId: string) {
  return prisma.member.findFirst({
    where: {
      organizationId,
      userId,
    },
  });
}
