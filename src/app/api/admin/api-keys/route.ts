import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, listResponse } from "@/app/api/response";
import { parseQuery } from "@/lib/api";
import { listApiKeys } from "@/repositories/admin/apiKeyRepository";
import { serializeApiKey } from "@/serializers/apiKeySerializer";
import { createApiKeySchema, listApiKeysSchema } from "./schema";
import { auth } from "@/lib/auth";
import type { CreatedApiKey } from "@/api/types/apiKey";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listApiKeysSchema);
  const apiKeys = await listApiKeys(parsed);
  return listResponse(apiKeys.map(serializeApiKey));
});

export const POST = withAdmin(async (request, _context, { session }) => {
  const body = await request.json();
  const { name } = createApiKeySchema.parse(body);

  const created = await auth.api.createApiKey({
    body: { name, userId: session.user.id },
  });

  const result: CreatedApiKey = {
    id: created.id,
    name: created.name,
    start: created.start ?? null,
    prefix: created.prefix ?? null,
    enabled: created.enabled ?? null,
    expiresAt: created.expiresAt ? new Date(created.expiresAt).toISOString() : null,
    createdAt: new Date(created.createdAt).toISOString(),
    key: created.key,
  };

  return createdResponse(result);
});
