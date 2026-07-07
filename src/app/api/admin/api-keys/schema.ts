import { z } from "zod";

export const listApiKeysSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["name", "createdAt", "expiresAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
  enabled: z
    .string()
    .transform((v) => v.split(","))
    .optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ListApiKeysParams = z.infer<typeof listApiKeysSchema>;
export type CreateApiKeyBody = z.infer<typeof createApiKeySchema>;
