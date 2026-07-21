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
  const { id: organizationId, memberId } = await params;
  const member = await findMemberByMemberId(memberId, organizationId);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const PATCH = withAdmin(async (request, { params }, { user }) => {
  const { id: organizationId, memberId } = await params;
  const existing = await findMemberByMemberId(memberId, organizationId);
  if (!existing) return notFoundResponse();
  if (existing.userId === user.id) {
    return forbiddenResponse("You cannot update your own membership.");
  }

  const body = updateMemberSchema.parse(await request.json());
  const updated = await updateMember(memberId, existing.organizationId, body);
  if (!updated) return notFoundResponse();
  return detailResponse(serializeMember({ ...updated }));
});

export const DELETE = withAdmin(async (_request, { params }, { user }) => {
  const { id: organizationId, memberId } = await params;
  const existing = await findMemberByMemberId(memberId, organizationId);
  if (!existing) return notFoundResponse();
  if (existing.userId === user.id) {
    return forbiddenResponse("You cannot remove your own membership.");
  }

  await deleteMember(memberId, organizationId);
  return noContentResponse();
});
