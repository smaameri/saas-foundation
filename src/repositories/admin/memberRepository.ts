import { prisma } from "@/lib/prisma";

export async function findMemberByUserId(userId: string) {
  return prisma.member.findFirst({
    where: { userId },
  });
}
