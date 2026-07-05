import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/app/api/admin/with-admin";
import { notFoundResponse } from "@/app/api/response";

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;

  const apiKey = await prisma.apikey.findUnique({ where: { id } });
  if (!apiKey) return notFoundResponse("API key not found.");

  await prisma.apikey.delete({ where: { id } });

  return new Response(null, { status: 204 });
});
