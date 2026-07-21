import { z } from "zod";
import { parseCommaSeparatedList } from "@/lib/api";
import { listSchema } from "@/app/api/schemas";

export const listAllOrganizationMembersSchema = listSchema.extend({
  search: z.string().optional(),
  organizationIds: z.string().transform(parseCommaSeparatedList).optional(),
  status: z.string().transform(parseCommaSeparatedList).optional(),
  sort: z.enum(["createdAt", "firstName", "lastName", "email"]).optional(),
});

export type ListAllOrganizationMembersParams = z.infer<typeof listAllOrganizationMembersSchema>;
