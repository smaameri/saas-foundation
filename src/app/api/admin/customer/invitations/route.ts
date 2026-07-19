import { listCustomerInvitationsSchema } from "./schema";
import { CreateInvitationValidator } from "./validator";
import { validateQuery } from "@/lib/api";
import { sendInvitation } from "@/services/admin/invitationService";
import { listCustomerPortalInvitations } from "@/repositories/admin/invitationRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, paginatedResponse, validationErrorResponse } from "@/app/api/response";

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listCustomerInvitationsSchema);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  const { data, total } = await listCustomerPortalInvitations({
    sort: parsed.sort,
    order: parsed.order,
    page,
    perPage,
    status: parsed.status,
    organizationIds: parsed.organizationIds,
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

  const { email, role, platformRole, organizationName } = validator.data;

  await sendInvitation({
    email,
    role,
    platformRole,
    organizationId,
    organizationName,
    inviterId: user.id,
    inviterName: user.name,
  });

  return createdResponse({ message: `Invitation sent to ${email}.` });
});
