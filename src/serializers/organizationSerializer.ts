import type { Organization as PrismaOrganization } from "@generated/prisma/client";
import type { Organization } from "@/services/api/types/organization";

export function serializeOrganization(organization: PrismaOrganization): Organization {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt.toISOString(),
  };
}
