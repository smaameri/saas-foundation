import { listOrganizationMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listMembers } from "@/repositories/admin/organizationMemberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request, { params }) => {
  const { id: organizationId } = await params;
  const validated = validateQuery(request, listOrganizationMembersSchema);
  const page = validated.page;
  const perPage = validated.perPage;

  const { data, total } = await listMembers(organizationId, {
    status: validated.status,
    search: validated.search,
    sort: validated.sort,
    order: validated.order,
    page,
    perPage,
  });

  return paginatedResponse(data.map(serializeMember), {
    page,
    perPage,
    total,
  });
});
