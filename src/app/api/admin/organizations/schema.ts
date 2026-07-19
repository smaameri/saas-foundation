import { z } from "zod";

export const listOrganizationsSchema = z.object({
  sort: z.enum(["name", "slug", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
});

export type ListOrganizationsParams = z.infer<typeof listOrganizationsSchema>;
export type CreateOrganizationBody = z.infer<typeof createOrganizationSchema>;
