import { CancelInvitationValidator } from "./validator";
import { withAdmin } from "@/app/api/admin/with-admin";
import { validationErrorResponse } from "@/app/api/response";
import { cancelInvitation } from "@/repositories/admin/invitationRepository";

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;

  const validator = new CancelInvitationValidator(id);
  const isValid = await validator.validate();
  if (!isValid) return validationErrorResponse(validator.errors);

  await cancelInvitation(validator.data.invitationId);

  return new Response(null, { status: 204 });
});
