import { z } from "zod";

export const listCustomerUsersSchema = z.object({
  sort: z.enum(["firstName", "lastName", "email", "role", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export type ListCustomerUsersParams = z.infer<typeof listCustomerUsersSchema>;
