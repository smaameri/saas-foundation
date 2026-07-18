import type { Apikey as PrismaApikey, User as PrismaUser } from "@generated/prisma/client";
import { serializeUser } from "@/serializers/userSerializer";
import type { ApiKey, CreatedApiKey } from "@/types/apiKey";

type ApiKeyInput = PrismaApikey & { user?: PrismaUser | null };

export function serializeApiKey(apiKey: ApiKeyInput): ApiKey {
  return {
    id: apiKey.id,
    name: apiKey.name,
    start: apiKey.start,
    prefix: apiKey.prefix,
    enabled: apiKey.enabled,
    expiresAt: apiKey.expiresAt?.toISOString() ?? null,
    lastRequest: apiKey.lastRequest?.toISOString() ?? null,
    createdAt: apiKey.createdAt.toISOString(),
    user: apiKey.user ? serializeUser(apiKey.user) : null,
  };
}

export function serializeCreatedApiKey(apiKey: ApiKeyInput & { key: string }): CreatedApiKey {
  return {
    ...serializeApiKey(apiKey),
    key: apiKey.key,
  };
}
