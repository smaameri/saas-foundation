import { listUserOrganizations } from "@/repositories/admin/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { listResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, _context, { user }) => {
  const organizations = await listUserOrganizations(user.id);
  return listResponse(organizations.map(serializeOrganization));
});
