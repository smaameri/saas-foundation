"use server";

import { z } from "zod";
import { fetchSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
});

export async function createOrganization(formData: FormData) {
  const parsed = createOrgSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { name, slug } = parsed.data;

  const session = await fetchSession();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized." };
  }

  const adminMember = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organization: { portals: { has: "admin" } },
    },
  });

  if (!adminMember) {
    return { ok: false, message: "Unauthorized." };
  }

  try {
    await prisma.organization.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug,
        portals: ["customer"],
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to create organization", error);
    const message =
      error instanceof Error ? error.message : "Failed to create organization. Please try again.";
    return { ok: false, message };
  }
}
