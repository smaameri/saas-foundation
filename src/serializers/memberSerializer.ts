import type { Member as PrismaMember, User as PrismaUser } from "@generated/prisma/client";
import type { Member } from "@/services/api/types/member";
import { serializeUser } from "@/serializers/userSerializer";

type MemberWithUser = PrismaMember & { user: PrismaUser };

export function serializeMember(member: MemberWithUser): Member {
  return {
    id: member.id,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
    user: serializeUser(member.user),
  };
}
