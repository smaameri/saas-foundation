import { listTeamMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listTeamMembers } from "@/repositories/admin/teamRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const validated = validateQuery(request, listTeamMembersSchema);
  const page = validated.page ?? 1;
  const perPage = validated.perPage ?? 10;

  const { data, total } = await listTeamMembers({
    sort: validated.sort,
    order: validated.order,
    page,
    perPage,
    status: validated.status,
  });
  return paginatedResponse(data.map(serializeUser), {
    page,
    perPage,
    total,
  });
});
