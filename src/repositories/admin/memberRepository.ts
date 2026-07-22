import { prisma } from "@/lib/prisma";

export async function findMember(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function updateMember(id: string, params: { role: string }) {
  return prisma.member.update({
    where: { id },
    data: { role: params.role },
    include: { user: true },
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}
