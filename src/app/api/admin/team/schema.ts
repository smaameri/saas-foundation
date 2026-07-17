import { z } from "zod";

export const listTeamMembersSchema = z.object({
  sort: z.enum(["createdAt", "role"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export type ListTeamMembersParams = z.infer<typeof listTeamMembersSchema>;
