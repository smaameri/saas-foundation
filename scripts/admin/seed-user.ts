import { cancel, intro, isCancel, outro, password, text } from "@clack/prompts";
import { APIError, isAPIError } from "better-auth/api";
import "dotenv/config";
import process from "node:process";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

async function promptOrExit() {
  intro("Seed admin user");

  const firstName = await text({
    message: "First name",
    validate: (value) => (!value?.trim() ? "First name is required" : undefined),
  });
  if (isCancel(firstName)) {
    cancel("Seed cancelled.");
    process.exitCode = 1;
    return null;
  }

  const lastName = await text({
    message: "Last name",
    validate: (value) => (!value?.trim() ? "Last name is required" : undefined),
  });
  if (isCancel(lastName)) {
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
        if (value.length < minPasswordLength)
          return `Password must be at least ${minPasswordLength} characters.`;
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

  const orgName = await text({
    message: "Organization name",
    validate: (value) => (!value?.trim() ? "Organization name is required" : undefined),
  });
  if (isCancel(orgName)) {
    cancel("Seed cancelled.");
    process.exitCode = 1;
    return null;
  }

  const defaultSlug = String(orgName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const orgSlug = await text({
    message: "Organization slug",
    initialValue: defaultSlug,
    validate: (value) => {
      if (!value?.trim()) return "Slug is required";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
        return "Slug must be lowercase letters, numbers, and hyphens only";
      return undefined;
    },
  });
  if (isCancel(orgSlug)) {
    cancel("Seed cancelled.");
    process.exitCode = 1;
    return null;
  }

  const firstNameStr = String(firstName).trim();
  const lastNameStr = String(lastName).trim();

  return {
    firstName: firstNameStr,
    lastName: lastNameStr,
    name: `${firstNameStr} ${lastNameStr}`,
    email: String(email).trim().toLowerCase(),
    password: pwdValue,
    orgName: String(orgName).trim(),
    orgSlug: String(orgSlug).trim().toLowerCase(),
  };
}

async function main() {
  try {
    const answers = await promptOrExit();
    if (!answers) return;

    const { firstName, lastName, name, email, password: pwd, orgName, orgSlug } = answers;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      cancel(`A user with email "${email}" already exists. No changes made.`);
      process.exitCode = 1;
      return;
    }

    // Create user
    await auth.api.signUpEmail({ body: { name, email, password: pwd, firstName, lastName } });

    const seededUser = await prisma.user.update({
      where: { email },
      data: { emailVerified: true, role: "admin" },
    });

    // Create organization (server-side, no session — uses userId)
    const org = await auth.api.createOrganization({
      body: { name: orgName, slug: orgSlug, userId: seededUser.id },
    });

    // Assign the admin portal via Prisma (portals is a custom field)
    await prisma.organization.update({
      where: { id: org.id },
      data: { portals: ["admin"] },
    });

    outro(
      `Done! User ${email} created and added to "${orgName}" (${orgSlug}) with the admin portal.`,
    );
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
