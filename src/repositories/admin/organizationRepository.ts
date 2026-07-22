import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { BaseListParams, SortOrder } from "@/repositories/types";

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

type OrganizationSortField = "name" | "slug" | "createdAt";

export type ListOrganizationsParams = {
  params: BaseListParams<OrganizationSortField>;
};

export async function listOrganizations({ params }: ListOrganizationsParams) {
  const { page, perPage, sort, order } = params;

  const [data, total] = await prisma.$transaction([
    prisma.organization.findMany({
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.organization.count(),
  ]);

  return { data, total };
}

export async function listUserOrganizations(userId: string) {
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

export async function updateOrganization(id: string, data: { name: string; slug: string }) {
  return prisma.organization.update({
    where: { id },
    data,
  });
}

export async function deleteOrganization(id: string) {
  return prisma.organization.delete({ where: { id } });
}

function buildOrderBy(sort: OrganizationSortField | undefined, order: SortOrder | undefined) {
  return { [sort ?? "name"]: order ?? "asc" } as const;
}
