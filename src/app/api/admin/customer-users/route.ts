import { listCustomerUsersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listCustomerUsers } from "@/repositories/admin/customerRepository";
import { serializeCustomerUser } from "@/serializers/customerUserSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listCustomerUsersSchema);
  const { data, total } = await listCustomerUsers(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  return paginatedResponse(data.map(serializeCustomerUser), {
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
    total_results: total,
  });
});
