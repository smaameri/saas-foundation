import {findInvitationById} from "@/repositories/admin/invitationRepository";
import {BaseValidator} from "@/validators/BaseValidator";

type ValidatedData = {
  invitationId: string;
};

export class CancelInvitationValidator extends BaseValidator<ValidatedData> {
  constructor(private invitationId: string) {
    super();
  }

  async validate(): Promise<boolean> {
    const invitation = await findInvitationById(this.invitationId);

    if (!invitation) {
      this.errors.push({path: ["invitationId"], message: "Invitation not found."});
      return false;
    }

    if (invitation.status !== "pending") {
      this.errors.push({path: ["invitationId"], message: "Only pending invitations can be canceled."});
      return false;
    }

    this.validatedData = {invitationId: this.invitationId};
    return true;
  }
}
