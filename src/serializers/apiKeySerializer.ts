import type { Apikey as PrismaApikey } from "@generated/prisma/client";
import type { ApiKey, CreatedApiKey } from "@/services/api/types/apiKey";

export function serializeApiKey(apiKey: PrismaApikey): ApiKey {
  return {
    id: apiKey.id,
    name: apiKey.name,
    start: apiKey.start,
    prefix: apiKey.prefix,
    enabled: apiKey.enabled,
    expiresAt: apiKey.expiresAt?.toISOString() ?? null,
    createdAt: apiKey.createdAt.toISOString(),
  };
}

export function serializeCreatedApiKey(apiKey: PrismaApikey & { key: string }): CreatedApiKey {
  return {
    ...serializeApiKey(apiKey),
    key: apiKey.key,
  };
}
