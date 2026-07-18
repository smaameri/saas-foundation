import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["admin", "user"]),
});

export type InviteMemberBody = z.infer<typeof inviteMemberSchema>;
