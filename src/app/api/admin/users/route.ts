import { withAdmin } from "@/app/api/admin/with-admin";
import { listResponse } from "@/app/api/response";
import { listUsersSchema } from "./schema";
import { listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";
import { parseQuery } from "@/lib/api";
import { serializeUser } from "@/serializers/userSerializer";

export const GET = withAdmin(async (request) => {
  const parsed = parseQuery(request, listUsersSchema);
  const users = await listAdminUsers(parsed);
  return listResponse(users.map(serializeUser));
});
