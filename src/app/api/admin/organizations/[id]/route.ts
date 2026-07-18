import { findById } from "@/repositories/admin/organizationRepository";
import { serializeOrganizationDetail } from "@/serializers/organizationSerializerLegacy";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, notFoundResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, context) => {
  const { id } = await context.params;
  const organization = await findById(id);
  if (!organization) return notFoundResponse("Organization not found");
  return detailResponse(serializeOrganizationDetail(organization));
});
