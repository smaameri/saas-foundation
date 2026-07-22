import { z } from "zod";
import { parseCommaSeparatedList } from "@/lib/api";
import { listSchema } from "@/app/api/schemas";

export const listMembersSchema = listSchema.extend({
  organizationIds: z.array(z.string()).optional(),
  search: z.string().optional(),
  status: z.string().transform(parseCommaSeparatedList).optional(),
  sort: z.enum(["createdAt", "firstName", "lastName", "email"]).optional(),
});

export type ListOrganizationMembersParams = z.infer<typeof listMembersSchema>;
