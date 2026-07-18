import { z } from "zod";

export const listAdminPortalInvitationsSchema = z.object({
  sort: z.enum(["email", "role", "status", "createdAt", "expiresAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export type ListAdminPortalInvitationsParams = z.infer<typeof listAdminPortalInvitationsSchema>;
