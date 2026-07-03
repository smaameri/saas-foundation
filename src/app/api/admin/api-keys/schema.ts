import { z } from "zod";

export const listApiKeysSchema = z.object({
  sort: z.enum(["name", "createdAt", "expiresAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ListApiKeysParams = z.infer<typeof listApiKeysSchema>;
export type CreateApiKeyParams = z.infer<typeof createApiKeySchema>;
