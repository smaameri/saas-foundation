import { listTeamMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listTeamMembers } from "@/repositories/admin/teamRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const validated = validateQuery(request, listTeamMembersSchema);
  const { data, total } = await listTeamMembers(validated);
  return paginatedResponse(data.map(serializeUser), {
    page: validated.page,
    perPage: validated.perPage,
    total,
  });
});
