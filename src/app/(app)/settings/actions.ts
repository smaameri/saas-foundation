"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const inviteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
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
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid form data",
    };
  }

  const { name, email, role } = parsed.data;

  try {
    await auth.api.signInMagicLink({
      headers: await headers(),
      body: {
        email,
        name,
        callbackURL: `${appUrl}/dashboard`,
        newUserCallbackURL: `${appUrl}/dashboard`,
        metadata: {
          role,
        },
      },
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
