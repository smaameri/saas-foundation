"use server";

import {headers} from "next/headers";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  image: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return {ok: false, message: parsed.error.issues[0]?.message ?? "Invalid data"};
  }

  const {firstName, lastName, image} = parsed.data;
  const name = `${firstName} ${lastName}`;

  try {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user?.id) {
      return {ok: false, message: "Not authenticated."};
    }

    await prisma.user.update({
      where: {id: session.user.id},
      data: {firstName, lastName, name, image: image || null},
    });

    return {ok: true, message: "Profile updated."};
  } catch (error) {
    console.error("Failed to update profile", error);
    return {ok: false, message: "Failed to update profile. Please try again."};
  }
}
