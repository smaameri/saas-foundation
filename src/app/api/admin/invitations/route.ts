import { listInvitationsSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { listInvitations } from "@/repositories/admin/invitationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const { page, perPage, order, sort, status, portals } = validateQuery(
    request,
    listInvitationsSchema,
  );

  const { data, total } = await listInvitations({
    options: { page, perPage, order, sort },
    filters: { status, portals },
  });

  return paginatedResponse(data.map(serializeInvitation), { page, perPage, total });
});
