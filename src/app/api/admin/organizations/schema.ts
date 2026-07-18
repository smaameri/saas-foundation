import { z } from "zod";

export const listOrganizationsSchema = z.object({
  sort: z.enum(["name", "slug", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export type ListOrganizationsParams = z.infer<typeof listOrganizationsSchema>;
