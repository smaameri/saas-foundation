import { listUsersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listUsers } from "@/repositories/admin/userRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const { page, perPage, order, sort, search, status } = validateQuery(request, listUsersSchema);
  const { data, total } = await listUsers({
    params: { page, perPage, order, sort },
    filters: { search, status },
  });

  return paginatedResponse(data.map(serializeUser), { page, perPage, total });
});
