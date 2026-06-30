import { prisma } from "@/lib/prisma";

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
