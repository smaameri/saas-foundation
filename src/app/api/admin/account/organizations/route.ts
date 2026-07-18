import { listOrganizationsForUser } from "@/repositories/admin/organizationRepository";
import { serializeUserOrganizationSummary } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { listResponse, noContentResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, _context, { user }) => {
  const memberships = await listOrganizationsForUser(user.id);
  return listResponse(memberships.map(serializeUserOrganizationSummary));
});

export const POST = withAdmin(async () => {
  return noContentResponse();
});
