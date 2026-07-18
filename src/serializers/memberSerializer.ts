import type {
  Member as PrismaMember,
  Organization as PrismaOrganization,
  User as PrismaUser,
} from "@generated/prisma/client";
import { serializeUser } from "@/serializers/userSerializer";
import type { Member } from "@/types/member";

type MemberWithUser = PrismaMember & {
  user: PrismaUser;
  organization?: Pick<PrismaOrganization, "id" | "name"> | null;
};

export function serializeMember(member: MemberWithUser): Member {
  return {
    id: member.id,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
    user: serializeUser(member.user),
    organization: member.organization
      ? {
          id: member.organization.id,
          name: member.organization.name,
        }
      : null,
  };
}
