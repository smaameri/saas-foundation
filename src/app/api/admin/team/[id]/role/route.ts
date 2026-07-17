import { z } from "zod";
import { updateMemberRole } from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse, notFoundResponse } from "@/app/api/response";

const changeRoleSchema = z.object({
  platformRole: z.enum(["admin", "user"]),
});

export const PATCH = withAdmin(async (request, { params }, { organizationId }) => {
  const { id } = await params;
  const { platformRole } = changeRoleSchema.parse(await request.json());
  const member = await updateMemberRole(id, organizationId, platformRole);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});
