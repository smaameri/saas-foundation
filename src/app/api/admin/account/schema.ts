import { z } from "zod";

export const updateAccountSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  image: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

export type UpdateAccountBody = z.infer<typeof updateAccountSchema>;
