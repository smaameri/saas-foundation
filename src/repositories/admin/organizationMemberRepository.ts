import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

type ListAllMembersParams = {
  search?: string;
  organizationId?: string[];
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
};

export async function findMemberByUserId(userId: string) {
  return prisma.member.findFirst({
    where: { userId },
  });
}

export async function findMemberById(id: string, organizationId: string) {
  return prisma.member.findFirst({
    where: { id, organizationId },
    include: { user: true },
  });
}

export async function updateMember(
  id: string,
  organizationId: string,
  params: {
    role: string;
    platformRole: string;
    firstName?: string | null;
    lastName?: string | null;
  },
) {
  const member = await prisma.member.update({
    where: { id, organizationId },
    data: { role: params.role },
    include: { user: true },
  });

  await prisma.user.update({
    where: { id: member.userId },
    data: {
      role: params.platformRole,
      firstName: params.firstName,
      lastName: params.lastName,
    },
  });

  return findMemberById(id, organizationId);
}

export async function updateMemberRole(id: string, organizationId: string, platformRole: string) {
  const member = await prisma.member.findFirst({ where: { id, organizationId } });
  if (!member) return null;

  await prisma.user.update({
    where: { id: member.userId },
    data: { role: platformRole },
  });

  return findMemberById(id, organizationId);
}

export async function listMembers(
  organizationId: string,
  params: {
    sort?: string;
    order?: SortOrder;
    page: number;
    perPage: number;
  },
) {
  const { page, perPage } = params;
  const where = { organizationId };

  const [data, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { [params.sort ?? "createdAt"]: params.order ?? "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.member.count({ where }),
  ]);

  return { data, total };
}

export async function listAllOrganizationMembers(params?: ListAllMembersParams) {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  const sort = params?.sort ?? "createdAt";
  const order = params?.order ?? "desc";

  const membersFilter: Prisma.MemberWhereInput = params?.organizationId?.length
    ? { organizationId: { in: params.organizationId } }
    : {};

  const where: Prisma.UserWhereInput = {
    members: {
      some: membersFilter,
    },
    ...(params?.search
      ? {
          OR: [
            { firstName: { contains: params.search, mode: "insensitive" } },
            { lastName: { contains: params.search, mode: "insensitive" } },
            { name: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  } as const;

  const orderBy: Prisma.UserOrderByWithRelationInput = (() => {
    switch (sort) {
      case "firstName":
      case "lastName":
      case "email":
        return { [sort]: order } as Prisma.UserOrderByWithRelationInput;
      default:
        return { createdAt: order };
    }
  })();

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        members: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}
