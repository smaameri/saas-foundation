import type { ApiKey } from "@/api/types/apiKey";
import type { listApiKeys } from "@/repositories/admin/apiKeyRepository";

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
