import { listAdminPortalInvitationsSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listAdminPortalInvitations } from "@/repositories/admin/invitationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listAdminPortalInvitationsSchema);
  const { data, total } = await listAdminPortalInvitations(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;

  return paginatedResponse(data.map(serializeInvitation), {
    page,
    perPage,
    total,
  });
});
