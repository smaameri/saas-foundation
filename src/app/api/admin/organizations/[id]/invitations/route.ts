import { CreateInvitationValidator } from "./validator";
import { sendInvitation } from "@/services/admin/invitationService";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, validationErrorResponse } from "@/app/api/response";

export const POST = withAdmin(async (request, { params }, { session }) => {
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
    inviterId: session.user.id,
    inviterName: session.user.name,
  });

  return createdResponse({ message: `Invitation sent to ${email}.` });
});
