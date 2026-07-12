import { createApiKeySchema, listApiKeysSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { auth } from "@/lib/auth";
import { listApiKeys } from "@/repositories/admin/apiKeyRepository";
import { serializeApiKey, serializeCreatedApiKey } from "@/serializers/apiKeySerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(
  async (request) => {
    const validated = validateQuery(request, listApiKeysSchema);
    const { data, total } = await listApiKeys(validated);
    return paginatedResponse(data.map(serializeApiKey), {
      page: validated.page,
      perPage: validated.perPage,
      total,
    });
  },
  { apiKey: ["read:any"] },
);

export const POST = withAdmin(async (request, _context, { user }) => {
  const body = await request.json();
  const { name } = createApiKeySchema.parse(body);

  const created = await auth.api.createApiKey({
    body: { name, userId: user.id },
  });

  return createdResponse(serializeCreatedApiKey(created));
});
