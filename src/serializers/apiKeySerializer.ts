import type { listApiKeys } from "@/repositories/admin/apiKeyRepository";
import type { ApiKey } from "@/services/api/types/apiKey";

type PrismaApiKey = Awaited<ReturnType<typeof listApiKeys>>["data"][number];

export function serializeApiKey(apiKey: PrismaApiKey): ApiKey {
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
