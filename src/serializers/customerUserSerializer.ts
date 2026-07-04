import type { listCustomerUsers } from "@/repositories/admin/customerRepository";
import type { User } from "@/api/types/user";

type PrismaUser = Awaited<ReturnType<typeof listCustomerUsers>>["data"][number];

export function serializeCustomerUser(user: PrismaUser): User {
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
