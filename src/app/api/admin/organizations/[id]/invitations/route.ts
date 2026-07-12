import { CreateInvitationValidator } from "./validator";
import { sendInvitation } from "@/services/admin/invitationService";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, validationErrorResponse } from "@/app/api/response";

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
