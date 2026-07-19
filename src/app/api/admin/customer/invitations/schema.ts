import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listCustomerInvitationsSchema = listSchema.extend({
  sort: z.enum(["createdAt", "expiresAt"]).optional(),
  status: z
    .string()
    .transform((value) => value.split(","))
    .optional(),
  organizationIds: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .optional(),
});

export type ListCustomerInvitationsParams = z.infer<typeof listCustomerInvitationsSchema>;
export type ListInvitationsParams = ListCustomerInvitationsParams;
export type ListOrganizationInvitationsParams = ListCustomerInvitationsParams;
