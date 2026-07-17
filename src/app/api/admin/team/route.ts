import { listMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listMembers } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request, _context, { organizationId }) => {
  const validated = validateQuery(request, listMembersSchema);
  const { data, total } = await listMembers(organizationId, validated);
  return paginatedResponse(data.map(serializeMember), {
    page: validated.page,
    perPage: validated.perPage,
    total,
  });
});
