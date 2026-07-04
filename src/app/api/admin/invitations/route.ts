import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";
import { parseQuery } from "@/lib/api";
import { listAdminInvitations } from "@/repositories/admin/adminOrganizationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { listInvitationsSchema } from "./schema";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listInvitationsSchema);
  const { data, total } = await listAdminInvitations(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  return paginatedResponse(data.map(serializeInvitation), {
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
    total_results: total,
  });
});
