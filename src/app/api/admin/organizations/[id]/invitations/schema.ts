import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listOrganizationInvitationsSchema = listSchema.extend({
  sort: z.enum(["createdAt", "expiresAt"]).optional(),
  status: z
    .string()
    .transform((value) => value.split(","))
    .optional(),
});

export type ListOrganizationInvitationsParams = z.infer<typeof listOrganizationInvitationsSchema>;
