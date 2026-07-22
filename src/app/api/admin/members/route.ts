import { listMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listMembers } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const validated = validateQuery(request, listMembersSchema);
  const { page, perPage, order, sort, search, status, organizationIds } = validated;
  const organizations = organizationIds?.filter(Boolean);

  const { data, total } = await listMembers({
    params: { page, perPage, order, sort },
    filters: {
      organizations: organizations && organizations.length > 0 ? organizations : undefined,
      status: status && status.length > 0 ? status : undefined,
      search,
    },
  });

  return paginatedResponse(data.map(serializeMember), {
    page,
    perPage,
    total,
  });
});
