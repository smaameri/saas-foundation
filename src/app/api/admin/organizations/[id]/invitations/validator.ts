import { z } from "zod";
import { findPendingInvitation } from "@/repositories/admin/invitationRepository";
import { findById } from "@/repositories/admin/organizationRepository";
import { BaseValidator } from "@/validators/BaseValidator";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

type ValidatedData = {
  email: string;
  role: string;
  organizationName: string;
};

export class CreateInvitationValidator extends BaseValidator<ValidatedData> {
  constructor(
    private organizationId: string,
    private body: unknown,
  ) {
    super();
  }

  async validate(): Promise<boolean> {
    const parsed = schema.safeParse(this.body);
    if (!parsed.success) {
      this.mapZodErrors(parsed.error.issues);
      return false;
    }

    const { email, role } = parsed.data;

    const organization = await findById(this.organizationId);
    if (!organization) {
      this.errors.push({ path: ["organizationId"], message: "Organization not found." });
      return false;
    }

    const existingInvitation = await findPendingInvitation(email, this.organizationId);
    if (existingInvitation) {
      this.errors.push({
        path: ["email"],
        message: "This person already has a pending invitation.",
      });
      return false;
    }

    this.validatedData = { email, role, organizationName: organization.name };
    return true;
  }
}
