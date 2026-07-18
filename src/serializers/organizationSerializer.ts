import type {
  Organization,
  OrganizationDetail,
  OrganizationMember,
  UserOrganizationSummary,
} from "@/services/api/types/organization";
import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import type {
  listAllOrganizationMembers,
  listMembers,
} from "@/repositories/admin/organizationMemberRepository";
import type {
  findById,
  listOrganizations,
  listOrganizationsForUser,
} from "@/repositories/admin/organizationRepository";

type PrismaOrganization = Awaited<ReturnType<typeof listOrganizations>>["data"][number];
type PrismaOrganizationDetail = NonNullable<Awaited<ReturnType<typeof findById>>>;
type PrismaOrganizationMember = Awaited<ReturnType<typeof listMembers>>["data"][number];
type PrismaOrganizationMemberUser = Awaited<
  ReturnType<typeof listAllOrganizationMembers>
>["data"][number];
type PrismaUserOrganizationSummary = Awaited<ReturnType<typeof listOrganizationsForUser>>[number];

export function serializeOrganization(org: PrismaOrganization): Organization {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug ?? null,
    memberCount: org._count.members,
    createdAt: org.createdAt.toISOString(),
  };
}

export function serializeOrganizationDetail(org: PrismaOrganizationDetail): OrganizationDetail {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug ?? null,
    createdAt: org.createdAt.toISOString(),
    memberCount: org._count?.members ?? org.members.length,
    members: org.members.map(serializeOrganizationMember),
  };
}

export function serializeOrganizationMember(member: PrismaOrganizationMember): OrganizationMember {
  return {
    id: member.id,
    role: member.role,
    platformRole: member.user.role,
    createdAt: member.createdAt.toISOString(),
    user: {
      id: member.user.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      name: member.user.name,
      email: member.user.email,
    },
  };
}

export function serializeOrganizationMemberUser(
  user: PrismaOrganizationMemberUser,
): OrganizationMemberUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    organizations: user.members
      .map((member) => ({
        id: member.organization.id,
        name: member.organization.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export function serializeUserOrganizationSummary(
  membership: PrismaUserOrganizationSummary,
): UserOrganizationSummary {
  return {
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    memberRole: membership.role,
  };
}
