import type { Organization } from "@/services/api/types/organization";
import type { listOrganizations } from "@/repositories/admin/organizationRepository";

type PrismaOrganization = Awaited<ReturnType<typeof listOrganizations>>["data"][number];

export function serializeOrganization(org: PrismaOrganization): Organization {
  return {
    id: org.id,
    name: org.name,
    memberCount: org._count.members,
    createdAt: org.createdAt.toISOString(),
  };
}
