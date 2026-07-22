import { z } from "zod";

export const updateMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

export type UpdateMemberBody = z.infer<typeof updateMemberSchema>;
