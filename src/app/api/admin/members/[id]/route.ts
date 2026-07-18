import { updateMemberSchema } from "./schema";
import {
  deleteMember,
  findMemberByMemberId,
  updateMember,
} from "@/repositories/admin/organizationMemberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import {
  detailResponse,
  forbiddenResponse,
  noContentResponse,
  notFoundResponse,
} from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  const member = await findMemberByMemberId(id);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const PATCH = withAdmin(async (request, { params }, { user }) => {
  const { id } = await params;
  const existing = await findMemberByMemberId(id);
  if (!existing) return notFoundResponse();
  if (existing.userId === user.id) {
    return forbiddenResponse("You cannot update your own membership.");
  }

  const body = updateMemberSchema.parse(await request.json());
  const updated = await updateMember(id, existing.organizationId, body);
  if (!updated) return notFoundResponse();
  return detailResponse(serializeMember({ ...updated, organization: existing.organization }));
});

export const DELETE = withAdmin(async (_request, { params }, { user }) => {
  const { id } = await params;
  const existing = await findMemberByMemberId(id);
  if (!existing) return notFoundResponse();
  if (existing.userId === user.id) {
    return forbiddenResponse("You cannot remove your own membership.");
  }

  await deleteMember(id);
  return noContentResponse();
});
