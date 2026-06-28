"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inviteSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

const appUrl =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

export async function invitePlatformUser(formData: FormData) {
  const parsed = inviteSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid form data",
    };
  }

  const { firstName, lastName, email, role } = parsed.data;
  const name = `${firstName} ${lastName}`;

  try {
    await auth.api.signInMagicLink({
      headers: await headers(),
      body: {
        email,
        name,
        callbackURL: `${appUrl}/platform/dashboard`,
        newUserCallbackURL: `${appUrl}/platform/dashboard`,
        metadata: { role },
      },
    });

    await prisma.user.update({
      where: { email },
      data: { firstName, lastName },
    });

    return {
      ok: true,
      message: `Invitation sent to ${email}.`,
    };
  } catch (error) {
    console.error("Failed to send invite", error);
    return {
      ok: false,
      message: "Failed to send invite. Please try again.",
    };
  }
}
