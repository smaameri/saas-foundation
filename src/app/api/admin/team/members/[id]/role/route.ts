import { z } from "zod";
import { updateTeamMemberRole } from "@/repositories/admin/teamRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { detailResponse } from "@/app/api/response";

const changeRoleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const { role } = changeRoleSchema.parse(await request.json());
  const user = await updateTeamMemberRole(id, role);
  return detailResponse(serializeUser(user));
});
