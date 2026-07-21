import { z } from "zod";
import { parseCommaSeparatedList } from "@/lib/api";
import { listSchema } from "@/app/api/schemas";

export const listCustomerInvitationsSchema = listSchema.extend({
  sort: z.enum(["createdAt", "expiresAt"]).optional(),
  status: z.string().transform(parseCommaSeparatedList).optional(),
  organizationIds: z.string().transform(parseCommaSeparatedList).optional(),
});

export type ListCustomerInvitationsParams = z.infer<typeof listCustomerInvitationsSchema>;
export type ListInvitationsParams = ListCustomerInvitationsParams;
export type ListOrganizationInvitationsParams = ListCustomerInvitationsParams;
