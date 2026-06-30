import { prisma } from "@/lib/prisma";

export async function belongsToAdminPortal(userId: string): Promise<boolean> {
  const member = await prisma.member.findFirst({
    where: {
      userId,
      organization: { portals: { has: "admin" } },
    },
  });
  return member !== null;
}
