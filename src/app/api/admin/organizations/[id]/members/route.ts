import { listAllOrganizationMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listAllOrganizationMembers } from "@/repositories/admin/organizationMemberRepository";
import { serializeOrganizationMemberUser } from "@/serializers/organizationSerializerLegacy";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const validated = validateQuery(request, listAllOrganizationMembersSchema);
  const page = validated.page;
  const perPage = validated.perPage;

  const { data, total } = await listAllOrganizationMembers({
    organizationIds: validated.organizationIds,
    status: validated.status,
    search: validated.search,
    sort: validated.sort,
    order: validated.order,
    page,
    perPage,
  });

  return paginatedResponse(data.map(serializeOrganizationMemberUser), {
    page,
    perPage,
    total,
  });
});
