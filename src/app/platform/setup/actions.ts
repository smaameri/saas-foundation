"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function setUserPassword(password: string) {
  const parsed = schema.safeParse({ password });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  try {
    await auth.api.setPassword({
      headers: await headers(),
      body: { newPassword: parsed.data.password },
    });

    return { ok: true, message: "Password set successfully." };
  } catch (error) {
    console.error("Failed to set password", error);
    return { ok: false, message: "Failed to set password. Please try again." };
  }
}
