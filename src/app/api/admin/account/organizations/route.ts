import { listOrganizationsForUser } from "@/repositories/admin/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { listResponse, noContentResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, _context, { user }) => {
  const organizations = await listOrganizationsForUser(user.id);
  return listResponse(organizations.map(serializeOrganization));
});

export const POST = withAdmin(async () => {
  return noContentResponse();
});
