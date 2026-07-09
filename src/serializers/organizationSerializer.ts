import type { Organization, OrganizationDetail } from "@/services/api/types/organization";
import type { findById, listOrganizations } from "@/repositories/admin/organizationRepository";

type PrismaOrganization = Awaited<ReturnType<typeof listOrganizations>>["data"][number];
type PrismaOrganizationDetail = NonNullable<Awaited<ReturnType<typeof findById>>>;

export function serializeOrganization(org: PrismaOrganization): Organization {
  return {
    id: org.id,
    name: org.name,
    memberCount: org._count.members,
    createdAt: org.createdAt.toISOString(),
  };
}

export function serializeOrganizationDetail(org: PrismaOrganizationDetail): OrganizationDetail {
  return {
    id: org.id,
    name: org.name,
    createdAt: org.createdAt.toISOString(),
    members: org.members.map((member) => ({
      id: member.id,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
      user: member.user,
    })),
  };
}
