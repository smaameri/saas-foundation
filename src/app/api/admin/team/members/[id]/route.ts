import { deleteTeamMember, findTeamMember } from "@/repositories/admin/teamRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import {
  detailResponse,
  forbiddenResponse,
  noContentResponse,
  notFoundResponse,
} from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  const user = await findTeamMember(id);
  if (!user) return notFoundResponse();
  return detailResponse(serializeUser(user));
});

export const DELETE = withAdmin(
  async (_request, { params }, { user }) => {
    const { id } = await params;
    if (id === user.id) {
      return forbiddenResponse("You cannot delete your own account.");
    }

    const deleted = await deleteTeamMember(id);
    if (!deleted) return notFoundResponse();

    return noContentResponse();
  },
  { user: ["delete"] },
);
