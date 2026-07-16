import { Apikey } from "@generated/prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { serializeApiKey } from "@/serializers/apiKeySerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, noContentResponse } from "@/app/api/response";

const updateApiKeySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const PATCH = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  const { name } = updateApiKeySchema.parse(await request.json());

  const updated = await auth.api.updateApiKey({
    body: { keyId: id, userId: user.id, name },
    headers: request.headers,
  });

  return detailResponse(serializeApiKey(updated as Apikey));
});

export const DELETE = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  await auth.api.updateApiKey({
    body: { keyId: id, userId: user.id, enabled: false },
    headers: request.headers,
  });
  return noContentResponse();
});
