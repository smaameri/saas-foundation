import { listOrganizationMembersSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listMembers } from "@/repositories/admin/organizationMemberRepository";
import { serializeOrganizationMember } from "@/serializers/organizationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const parsed = validateQuery(request, listOrganizationMembersSchema);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;

  const { data, total } = await listMembers(id, {
    sort: parsed.sort,
    order: parsed.order,
    page,
    perPage,
  });

  return paginatedResponse(data.map(serializeOrganizationMember), {
    page,
    perPage,
    total,
  });
});
