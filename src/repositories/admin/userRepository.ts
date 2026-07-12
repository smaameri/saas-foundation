import { prisma } from "@/lib/prisma";

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(
  id: string,
  data: { firstName: string; lastName: string; image?: string | null },
) {
  return prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      image: data.image || null,
    },
  });
}
