import { CancelAdminTeamInvitationValidator } from "./validator";
import { cancelInvitation } from "@/repositories/admin/invitationRepository";
import { withAdmin } from "@/app/api/admin/with-admin";
import { noContentResponse, validationErrorResponse } from "@/app/api/response";

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;

  const validator = new CancelAdminTeamInvitationValidator(id);
  const isValid = await validator.validate();
  if (!isValid) return validationErrorResponse(validator.errors);

  await cancelInvitation(validator.data.invitationId);

  return noContentResponse();
});
