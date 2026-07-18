import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listAdminPortalInvitationsSchema = listSchema.extend({
  sort: z.enum(["email", "role", "status", "createdAt", "expiresAt"]).optional(),
  status: z
    .string()
    .transform((value) => value.split(","))
    .optional(),
});

export type ListAdminPortalInvitationsParams = z.infer<typeof listAdminPortalInvitationsSchema>;
