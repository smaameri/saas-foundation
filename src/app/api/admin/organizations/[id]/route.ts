import { findById } from "@/repositories/admin/organizationRepository";
import { serializeOrganizationDetail } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { notFoundResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, context) => {
  const { id } = await context.params;
  const organization = await findById(id);
  if (!organization) return notFoundResponse("Organization not found");
  return Response.json(serializeOrganizationDetail(organization));
});
