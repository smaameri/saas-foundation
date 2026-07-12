import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { serializeApiKey } from "@/serializers/apiKeySerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, notFoundResponse } from "@/app/api/response";

const updateApiKeySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const PATCH = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  const { name } = updateApiKeySchema.parse(await request.json());

  const apiKey = await prisma.apikey.findFirst({ where: { id, referenceId: user.id } });
  if (!apiKey) return notFoundResponse();

  const updated = await prisma.apikey.update({ where: { id }, data: { name } });
  return detailResponse(serializeApiKey(updated));
});
