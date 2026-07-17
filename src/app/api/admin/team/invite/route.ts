import { inviteMemberSchema } from "./schema";
import type { User as PrismaUser } from "@generated/prisma/client";
import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth/auth";
import { findUserByEmail } from "@/repositories/admin/teamRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { createdResponse } from "@/app/api/response";

export const POST = withAdmin(async (request) => {
  const { email, firstName, lastName, role } = inviteMemberSchema.parse(await request.json());

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return createdResponse(serializeUser(existingUser));
  }

  const { user } = await auth.api.createUser({
    body: {
      email,
      password: randomBytes(24).toString("base64url"),
      name: `${firstName} ${lastName}`,
      role,
      data: { firstName, lastName },
    },
  });

  await auth.api.requestPasswordReset({ body: { email } });

  // TODO: create the invitation for the admin organization.

  // `additionalFields` (firstName/lastName) aren't reflected in the admin plugin's
  // generic return type, though they are persisted and present at runtime.
  return createdResponse(serializeUser(user as unknown as PrismaUser));
});
