import { listMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listOrganizationMembers } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request, { params }) => {
  const { id: organizationId } = await params;
  const validated = validateQuery(request, listMembersSchema);
  const page = validated.page;
  const perPage = validated.perPage;

  const { data, total } = await listOrganizationMembers(organizationId, {
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
