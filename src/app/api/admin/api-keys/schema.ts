import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listApiKeysSchema = listSchema.extend({
  search: z.string().optional(),
  enabled: z
    .string()
    .transform((v) => v.split(","))
    .optional(),
  sort: z.enum(["name", "createdAt", "expiresAt"]).optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateApiKeyBody = z.infer<typeof createApiKeySchema>;
