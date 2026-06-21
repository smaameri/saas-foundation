import "dotenv/config";

import process from "node:process";

import {APIError, isAPIError} from "better-auth/api";
import {cancel, intro, isCancel, outro, password, text} from "@clack/prompts";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

async function promptOrExit() {
  intro("Seed admin user");

  const name = await text({
    message: "Display name",
    validate: (value) => (!value?.trim() ? "Name is required" : undefined),
  });
  if (isCancel(name)) {
    cancel("Seed cancelled.");
    process.exitCode = 1;
    return null;
  }

  const email = await text({
    message: "Email",
    validate: (value) => {
      if (!value?.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return undefined;
    },
  });
  if (isCancel(email)) {
    cancel("Seed cancelled.");
    process.exitCode = 1;
    return null;
  }

  let pwdValue: string | null = null;
  const minPasswordLength = 8;

  while (pwdValue === null) {
    const pwd = await password({
      message: `Password (min ${minPasswordLength} characters)`,
      validate: (value) => {
        if (!value) return "Password is required";
        if (value.length < minPasswordLength) {
          return `Password must be at least ${minPasswordLength} characters.`;
        }
        return undefined;
      },
    });

    if (isCancel(pwd)) {
      cancel("Seed cancelled.");
      process.exitCode = 1;
      return null;
    }

    pwdValue = String(pwd);
  }

  return {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: pwdValue,
  };
}

async function main() {
  try {
    const answers = await promptOrExit();
    if (!answers) return;

    const {name, email, password: pwd} = answers;

    if (!("user" in prisma)) {
      cancel("Prisma client is missing the user model. Check Prisma generation.");
      process.exitCode = 1;
      return;
    }

    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
      cancel(`A user with email \"${email}\" already exists. No changes made.`);
      process.exitCode = 1;
      return;
    }

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password: pwd,
      },
    });

    const seededUser = await prisma.user.update({
      where: {email},
      data: {
        emailVerified: true,
        platformRole: "admin",
      },
    });

    outro(`Seed user created (id: ${seededUser.id}). You can now sign in with ${email}.`);
  } catch (error) {
    if (isAPIError(error)) {
      cancel(`Better Auth API error (${error.status}): ${error.message}`);
      process.exitCode = 1;
    } else if (error instanceof APIError) {
      cancel(`Better Auth API error (${error.status}): ${error.message}`);
      process.exitCode = 1;
    } else {
      cancel("Unexpected error seeding user. Check logs for details.");
      console.error(error);
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();
