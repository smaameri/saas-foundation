import type { User } from "@/services/api/types/user";
import type { listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";

type PrismaUser = Awaited<ReturnType<typeof listAdminUsers>>["data"][number];

export function serializeUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    banned: user.banned,
    banReason: user.banReason,
    banExpires: user.banExpires?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    organizations: user.members.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
    })),
  };
}
