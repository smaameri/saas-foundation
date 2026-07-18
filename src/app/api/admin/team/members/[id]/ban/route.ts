import { APIError } from "better-auth";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import {
  conflictResponse,
  detailResponse,
  forbiddenResponse,
  notFoundResponse,
} from "@/app/api/response";

const banUserSchema = z.object({
  banReason: z.string().trim().max(255).optional(),
  banExpiresIn: z.number().int().positive().optional(),
});

export const POST = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  if (id === user.id) {
    return forbiddenResponse("You cannot ban your own account.");
  }
  const { banReason, banExpiresIn } = banUserSchema.parse(await request.json());

  try {
    await auth.api.banUser({
      body: {
        userId: id,
        banReason,
        banExpiresIn,
      },
      headers: request.headers,
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "NOT_FOUND") {
        return notFoundResponse(error.body?.message ?? "User not found.");
      }
      if (error.status === "FORBIDDEN") {
        return forbiddenResponse(
          error.body?.message ?? "You do not have permission to ban this user.",
        );
      }
      return conflictResponse(error.body?.message ?? "Failed to ban user.");
    }
    throw error;
  }

  const updated = await prisma.user.findUnique({ where: { id } });
  if (!updated) {
    return notFoundResponse("User not found.");
  }

  return detailResponse(serializeUser(updated));
});
