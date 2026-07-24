import { deleteMember, findOrganizationMember } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, noContentResponse, notFoundResponse } from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }) => {
  const { id: organizationId, memberId } = await params;
  const member = await findOrganizationMember(organizationId, memberId);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const DELETE = withAdmin(
  async (_request, { params }) => {
    const { id: organizationId, memberId } = await params;

    const existing = await findOrganizationMember(organizationId, memberId);
    if (!existing) return notFoundResponse();

    await deleteMember(memberId);
    return noContentResponse();
  },
  { member: ["delete"] },
);
