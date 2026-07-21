import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

type CreateOrganizationInput = {
  name: string;
  slug: string;
};

export async function createOrganization({ name, slug }: CreateOrganizationInput) {
  return prisma.organization.create({
    data: {
      id: randomUUID(),
      name,
      slug,
    },
  });
}

export async function findById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
  });
}

export async function listOrganizations(params?: {
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const [data, total] = await prisma.$transaction([
    prisma.organization.findMany({
      orderBy: { [params?.sort ?? "name"]: params?.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.organization.count(),
  ]);

  return { data, total };
}

export async function listOrganizationsForUser(userId: string) {
  return prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
