import { updateMemberRoleSchema } from "./schema";
import { findOrganizationMember, updateMemberRole } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, notFoundResponse } from "@/app/api/response";

export const PATCH = withAdmin(
  async (request, { params }) => {
    const { id: organizationId, memberId } = await params;

    const existing = await findOrganizationMember(organizationId, memberId);
    if (!existing) return notFoundResponse();

    const body = updateMemberRoleSchema.parse(await request.json());
    const updated = await updateMemberRole(memberId, body.role);

    return detailResponse(serializeMember(updated));
  },
  { member: ["update"] },
);
