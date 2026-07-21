import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import type { listAllOrganizationMembers } from "@/repositories/admin/organizationMemberRepository";

type PrismaOrganizationMemberUser = Awaited<
  ReturnType<typeof listAllOrganizationMembers>
>["data"][number];

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
    banned: user.banned,
    banReason: user.banReason,
    banExpires: user.banExpires?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    organizations: user.members
      .map((member) => ({
        id: member.organization.id,
        name: member.organization.name,
        memberId: member.id,
        memberRole: member.role,
        joinedAt: member.createdAt.toISOString(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
