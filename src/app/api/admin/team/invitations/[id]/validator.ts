import { findAdminInvitationById } from "@/repositories/auth/invitationRepository";
import { BaseValidator } from "@/validators/BaseValidator";

export type CancelAdminTeamInvitationData = {
  invitationId: string;
};

export class CancelAdminTeamInvitationValidator extends BaseValidator<CancelAdminTeamInvitationData> {
  constructor(private invitationId: string) {
    super();
  }

  async validate(): Promise<boolean> {
    const invitation = await findAdminInvitationById(this.invitationId);

    if (!invitation) {
      this.errors.push({ path: ["invitationId"], message: "Invitation not found." });
      return false;
    }

    if (invitation.status !== "pending") {
      this.errors.push({
        path: ["invitationId"],
        message: "Only pending invitations can be canceled.",
      });
      return false;
    }

    this.validatedData = { invitationId: this.invitationId };
    return true;
  }
}
