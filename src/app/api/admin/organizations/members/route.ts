import { listAllOrganizationMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listAllOrganizationMembers } from "@/repositories/admin/organizationMemberRepository";
import { serializeOrganizationMemberUser } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listAllOrganizationMembersSchema);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;

  const { data, total } = await listAllOrganizationMembers({
    search: parsed.search,
    sort: parsed.sort,
    order: parsed.order,
    page,
    perPage,
    organizationId: parsed.organizationId,
    status: parsed.status,
  });

  return paginatedResponse(data.map(serializeOrganizationMemberUser), {
    page,
    perPage,
    total,
  });
});
