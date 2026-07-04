import { z } from "zod";

export const listInvitationsSchema = z.object({
  sort: z.enum(["email", "role", "status", "createdAt", "expiresAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export type ListInvitationsParams = z.infer<typeof listInvitationsSchema>;
