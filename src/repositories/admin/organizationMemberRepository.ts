import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

type ListAllMembersParams = {
  search?: string;
  organizationIds?: string[];
  sort?: string;
  order?: SortOrder;
  page?: number;
  perPage?: number;
  status?: string[];
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

export async function findMemberByMemberId(id: string, organizationId: string) {
  return prisma.member.findFirst({
    where: { id, organizationId },
    include: {
      user: true,
      organization: true,
    },
  });
}

export async function updateMember(
  id: string,
  organizationId: string,
  params: {
    role: string;
  },
) {
  return await prisma.member.update({
    where: { id, organizationId },
    data: { role: params.role },
    include: { user: true },
  });
}

export async function deleteMember(id: string, organizationId: string) {
  return prisma.member.deleteMany({ where: { id, organizationId } });
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
    search?: string;
    status?: string[];
  },
) {
  const { page, perPage } = params;
  const userWhere: Prisma.UserWhereInput = {};

  if (params.search) {
    userWhere.OR = [
      { firstName: { contains: params.search, mode: "insensitive" } },
      { lastName: { contains: params.search, mode: "insensitive" } },
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.status && params.status.length > 0) {
    const normalized = params.status.map((status) => status.toLowerCase());
    const includeActive = normalized.includes("active");
    const includeBanned = normalized.includes("banned");

    if (!(includeActive && includeBanned)) {
      const statusCondition = includeBanned
        ? { banned: true }
        : includeActive
          ? { OR: [{ banned: false }, { banned: null }] }
          : undefined;

      if (statusCondition) {
        if (userWhere.OR) {
          userWhere.AND = [...(userWhere.AND ?? []), statusCondition];
        } else {
          Object.assign(userWhere, statusCondition);
        }
      }
    }
  }

  const where: Prisma.MemberWhereInput = {
    organizationId,
    ...(Object.keys(userWhere).length > 0 ? { user: userWhere } : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: {
        user: true,
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

  const membersFilter: Prisma.MemberWhereInput = params?.organizationIds?.length
    ? { organizationId: { in: params.organizationIds } }
    : {};

  const statusFilters = (() => {
    if (!params?.status || params.status.length === 0) return undefined;
    const normalized = params.status.map((status) => status.toLowerCase());
    const includeActive = normalized.includes("active");
    const includeBanned = normalized.includes("banned");

    if (includeActive && includeBanned) return undefined;
    if (includeBanned) {
      return { banned: true };
    }
    if (includeActive) {
      return { OR: [{ banned: false }, { banned: null }] } as Prisma.UserWhereInput;
    }
    return undefined;
  })();

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
    ...(statusFilters ?? {}),
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
