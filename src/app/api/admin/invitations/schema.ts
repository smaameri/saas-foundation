import { z } from "zod";
import { parseCommaSeparatedList } from "@/lib/api";
import { listSchema } from "@/app/api/schemas";
import { Portal } from "@/config/portals";

export const listInvitationsSchema = listSchema.extend({
  sort: z.enum(["email", "role", "status", "createdAt", "expiresAt"]).optional(),
  status: z.string().transform(parseCommaSeparatedList).optional(),
  portals: z
    .string()
    .transform(parseCommaSeparatedList)
    .pipe(z.array(z.enum([Portal.admin, Portal.customer])))
    .optional(),
});

export type ListInvitationsParams = z.infer<typeof listInvitationsSchema>;
