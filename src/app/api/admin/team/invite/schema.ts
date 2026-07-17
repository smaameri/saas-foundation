import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  role: z.enum(["admin", "user"]),
});

export type InviteMemberBody = z.infer<typeof inviteMemberSchema>;
