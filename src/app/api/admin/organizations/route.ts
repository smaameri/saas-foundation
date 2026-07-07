import { listOrganizationsSchema } from "./schema";
import { parseQuery } from "@/lib/api";
import { listOrganizations } from "@/repositories/admin/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listOrganizationsSchema);
  const { data, total } = await listOrganizations(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  return paginatedResponse(data.map(serializeOrganization), {
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
    total_results: total,
  });
});
