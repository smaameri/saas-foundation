import { updateAccountSchema } from "./schema";
import { updateUser } from "@/repositories/admin/userRepository";
import { withAdmin } from "@/app/api/admin/with-admin";
import { noContentResponse } from "@/app/api/response";

export const PATCH = withAdmin(async (request, _context, { user }) => {
  const validated = updateAccountSchema.parse(await request.json());
  await updateUser(user.id, validated);
  return noContentResponse();
});
