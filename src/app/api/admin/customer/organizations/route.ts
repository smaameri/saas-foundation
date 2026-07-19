import { createOrganizationSchema, listOrganizationsSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { listOrganizations } from "@/repositories/admin/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { conflictResponse, createdResponse, paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const validated = validateQuery(request, listOrganizationsSchema);
  const { data, total } = await listOrganizations(validated);
  const page = validated.page;
  const perPage = validated.perPage;
  return paginatedResponse(data.map(serializeOrganization), {
    page,
    perPage: perPage,
    total: total,
  });
});

export const POST = withAdmin(async (request) => {
  const body = createOrganizationSchema.parse(await request.json());

  try {
    await prisma.organization.create({
      data: {
        id: crypto.randomUUID(),
        name: body.name,
        slug: body.slug,
      },
    });
  } catch (error) {
    console.error("Failed to create organization", error);
    const message =
      error instanceof Error ? error.message : "Failed to create organization. Please try again.";
    return conflictResponse(message);
  }

  return createdResponse({ message: "Organization created." });
});
