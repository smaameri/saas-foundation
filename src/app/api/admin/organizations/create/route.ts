import { createOrganizationSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/app/api/admin/with-admin";
import { conflictResponse, createdResponse } from "@/app/api/response";

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
