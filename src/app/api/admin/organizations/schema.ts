import { z } from "zod";

export const listOrganizationsSchema = z.object({
  sort: z.enum(["name", "slug", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
});

const organizationPayloadSchema = z.object({
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

export const createOrganizationSchema = organizationPayloadSchema;
export const updateOrganizationSchema = organizationPayloadSchema;

export type CreateOrganizationBody = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;
