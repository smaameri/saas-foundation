import { listCustomerInvitationsSchema } from "./schema";
import { CreateInvitationValidator } from "./validator";
import { validateQuery } from "@/lib/api";
import { sendInvitation } from "@/services/admin/invitationService";
import { listInvitations } from "@/repositories/admin/invitationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, paginatedResponse, validationErrorResponse } from "@/app/api/response";
import { Portal } from "@/config/portals";

export const GET = withAdmin(async (request, { params }) => {
  const { id: organizationId } = await params;
  const parsed = validateQuery(request, listCustomerInvitationsSchema);
  const { page, perPage, order, sort, status } = parsed;

  const { data, total } = await listInvitations({
    options: { page, perPage, order, sort },
    filters: {
      status,
      portals: [Portal.customer],
      organizationIds: [organizationId],
    },
  });

  return paginatedResponse(data.map(serializeInvitation), {
    page,
    perPage,
    total,
  });
});

export const POST = withAdmin(async (request, { params }, { user }) => {
  const { id: organizationId } = await params;
  const body = await request.json();

  const validator = new CreateInvitationValidator(organizationId, body);
  const isValid = await validator.validate();
  if (!isValid) return validationErrorResponse(validator.errors);

  const { email, role, organizationName } = validator.data;

  await sendInvitation({
    email,
    role,
    organizationId,
    organizationName,
    inviterId: user.id,
    inviterName: user.name,
  });

  return createdResponse({ message: `Invitation sent to ${email}.` });
});
