import { createApiKeySchema, listApiKeysSchema } from "./schema";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, paginatedResponse } from "@/app/api/response";
import { parseQuery } from "@/lib/api";
import { auth } from "@/lib/auth";
import { listApiKeys } from "@/repositories/admin/apiKeyRepository";
import { serializeApiKey } from "@/serializers/apiKeySerializer";
import type { CreatedApiKey } from "@/services/api/types/apiKey";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listApiKeysSchema);
  const { data, total } = await listApiKeys(parsed);
  const page = parsed.page ?? 1;
  const perPage = parsed.perPage ?? 10;
  return paginatedResponse(data.map(serializeApiKey), {
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
    total_results: total,
  });
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
