import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listAdminPortalInvitationsSchema = listSchema.extend({
  sort: z.enum(["email", "role", "status", "createdAt", "expiresAt"]).optional(),
  status: z
    .string()
    .transform((value) => value.split(","))
    .optional(),
});

export const createAdminPortalInvitationSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["admin", "user"]),
});

export type ListAdminPortalInvitationsParams = z.infer<typeof listAdminPortalInvitationsSchema>;
export type CreateAdminPortalInvitationBody = z.infer<typeof createAdminPortalInvitationSchema>;
