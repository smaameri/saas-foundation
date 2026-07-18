import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listOrganizationMembersSchema = listSchema.extend({
  sort: z.enum(["createdAt"]).optional(),
});

export type ListOrganizationMembersParams = z.infer<typeof listOrganizationMembersSchema>;
