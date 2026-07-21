import { z } from "zod";

export const updateMemberSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().optional(),
  platformRole: z.enum(["admin", "user"]),
  role: z.enum(["owner", "admin", "member"]),
});

export type UpdateMemberBody = z.infer<typeof updateMemberSchema>;
