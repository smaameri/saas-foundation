import { withAdmin } from "@/app/api/admin/with-admin";
import { listResponse } from "@/app/api/response";
import { listOrganizations } from "@/repositories/admin/customerRepository";

export const GET = withAdmin(async () => {
  const organizations = await listOrganizations();
  return listResponse(organizations);
});
