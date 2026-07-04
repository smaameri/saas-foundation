import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";
import { parseQuery } from "@/lib/api";
import { listCustomerUsers } from "@/repositories/admin/customerRepository";
import { serializeCustomerUser } from "@/serializers/customerUserSerializer";
import { listCustomerUsersSchema } from "./schema";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listCustomerUsersSchema);
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
