import { updateMemberRoleSchema } from "./schema";
import {
  findOrganizationMember,
  updateMemberRole,
} from "@/repositories/customers/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withCustomer } from "@/app/api/customer/with-customer";
import { detailResponse, forbiddenResponse, notFoundResponse } from "@/app/api/response";

export const PATCH = withCustomer(
  async (request, { params }, { organizationId, user }) => {
    const { memberId } = await params;
    const member = await findOrganizationMember(organizationId, memberId);
    if (!member) return notFoundResponse("Member not found.");
    if (member.userId === user.id) {
      return forbiddenResponse("You cannot change your own organization role.");
    }

    const { role } = updateMemberRoleSchema.parse(await request.json());
    const updated = await updateMemberRole(memberId, role);
    return detailResponse(serializeMember(updated));
  },
  { member: ["update"] },
);
