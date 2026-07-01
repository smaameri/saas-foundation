import { z } from "zod";

export const listUsersSchema = z.object({
  sort: z.enum(["firstName", "lastName", "email", "role", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type ListUsersParams = z.infer<typeof listUsersSchema>;
