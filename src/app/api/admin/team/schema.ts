import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listTeamMembersSchema = listSchema.extend({
  sort: z.enum(["createdAt", "role"]).optional(),
  status: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .optional(),
});

export type ListTeamMembersParams = z.infer<typeof listTeamMembersSchema>;
