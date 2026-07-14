import { validateQuery } from "@/lib/api";
import { auth } from "@/lib/auth/auth";
import { listApiKeysForUser } from "@/repositories/admin/apiKeyRepository";
import { serializeApiKey, serializeCreatedApiKey } from "@/serializers/apiKeySerializer";
import { createApiKeySchema, listApiKeysSchema } from "@/app/api/admin/api-keys/schema";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse, paginatedResponse } from "@/app/api/response";

export const GET = withAdmin(async (request, _context, { user }) => {
  const validated = validateQuery(request, listApiKeysSchema);
  const { data, total } = await listApiKeysForUser({ ...validated, userId: user.id });
  return paginatedResponse(data.map(serializeApiKey), {
    page: validated.page,
    perPage: validated.perPage,
    total,
  });
});

export const POST = withAdmin(async (request, _context, { user }) => {
  const { name } = createApiKeySchema.parse(await request.json());
  const created = await auth.api.createApiKey({ body: { name, userId: user.id } });
  return createdResponse(serializeCreatedApiKey(created));
});
