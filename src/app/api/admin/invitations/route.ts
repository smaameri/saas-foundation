import { listInvitationsSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listAdminInvitations } from "@/repositories/admin/adminOrganizationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listInvitationsSchema);
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
