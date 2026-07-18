import { updateMemberSchema } from "./schema";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth/auth";
import { findMemberById, updateMember } from "@/repositories/admin/organizationMemberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import {
  conflictResponse,
  detailResponse,
  forbiddenResponse,
  noContentResponse,
  notFoundResponse,
} from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }, { organizationId }) => {
  const { id } = await params;
  const member = await findMemberById(id, organizationId);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const PATCH = withAdmin(async (request, { params }, { organizationId, user }) => {
  const { id } = await params;
  if (id === user.id) {
    return forbiddenResponse("You cannot update your own account from this endpoint.");
  }
  const body = updateMemberSchema.parse(await request.json());
  const member = await updateMember(id, organizationId, body);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const DELETE = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  if (id === user.id) {
    return forbiddenResponse("You cannot delete your own account.");
  }

  try {
    await auth.api.removeUser({
      body: { userId: id },
      headers: request.headers,
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "NOT_FOUND") return notFoundResponse(error.body?.message);
      if (error.status === "FORBIDDEN") return forbiddenResponse(error.body?.message);
      return conflictResponse(error.body?.message ?? "Failed to delete user.");
    }
    throw error;
  }

  return noContentResponse();
});
