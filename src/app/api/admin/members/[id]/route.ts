import { updateMemberSchema } from "./schema";
import { findMemberById, updateMember } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, notFoundResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }, { organizationId }) => {
  const { id } = await params;
  const member = await findMemberById(id, organizationId);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const PATCH = withAdmin(async (request, { params }, { organizationId }) => {
  const { id } = await params;
  const body = updateMemberSchema.parse(await request.json());
  const member = await updateMember(id, organizationId, body);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});
