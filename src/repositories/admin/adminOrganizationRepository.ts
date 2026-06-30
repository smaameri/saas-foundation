import { Portal } from "@/config/portals";
import { prisma } from "@/lib/prisma";

export async function findAdminOrganization() {
  return prisma.organization.findFirst({
    where: { portals: { has: Portal.admin } },
  });
}

const sortableFields = ["firstName", "lastName", "email", "role", "createdAt"] as const;
type SortField = (typeof sortableFields)[number];
type SortOrder = "asc" | "desc";

function isValidSortField(field: unknown): field is SortField {
  return sortableFields.includes(field as SortField);
}

export async function listAdminUsers(params?: { sort?: string; order?: string }) {
  const sort: SortField = isValidSortField(params?.sort) ? params.sort : "createdAt";
  const order: SortOrder = params?.order === "desc" ? "desc" : "asc";

  return prisma.user.findMany({
    where: {
      members: {
        some: {
          organization: { portals: { has: Portal.admin } },
        },
      },
    },
    include: {
      members: {
        include: { organization: true },
      },
    },
    orderBy: { [sort]: order },
  });
}

const invitationSortableFields = ["email", "role", "status", "createdAt", "expiresAt"] as const;
type InvitationSortField = (typeof invitationSortableFields)[number];

function isValidInvitationSortField(field: unknown): field is InvitationSortField {
  return invitationSortableFields.includes(field as InvitationSortField);
}

export async function listAdminInvitations(params?: { sort?: string; order?: string }) {
  const sort: InvitationSortField = isValidInvitationSortField(params?.sort) ? params.sort : "createdAt";
  const order: SortOrder = params?.order === "asc" ? "asc" : "desc";

  return prisma.invitation.findMany({
    where: { organization: { portals: { has: Portal.admin } } },
    orderBy: { [sort]: order },
  });
}
