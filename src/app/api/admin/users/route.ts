import { listUsersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listUsersSchema);
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
