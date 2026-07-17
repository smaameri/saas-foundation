import { inviteMemberSchema } from "./schema";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse } from "@/app/api/response";

export const POST = withAdmin(async (request) => {
  const body = inviteMemberSchema.parse(await request.json());

  // TODO: create the invitation for the admin organization.

  return createdResponse(body);
});
