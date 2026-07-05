import { listUsersSchema } from "./schema";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";
import { parseQuery } from "@/lib/api";
import { listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";
import { serializeUser } from "@/serializers/userSerializer";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listUsersSchema);
  const { data, total } = await listAdminUsers(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  return paginatedResponse(data.map(serializeUser), {
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
    total_results: total,
  });
});
