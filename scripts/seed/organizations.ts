import { faker } from "@faker-js/faker";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

const SEED_ORGS = 5;

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

export async function seedOrganizations() {
  const orgs: { id: string; name: string }[] = [];

  for (let i = 0; i < SEED_ORGS; i++) {
    const name = faker.company.name();
    const slug = `${makeSlug(name)}-${faker.string.nanoid(6).toLowerCase()}`;

    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      orgs.push({ id: existing.id, name: existing.name });
      continue;
    }

    const dummyOwnerEmail = `seed-owner-${slug}@example.com`;
    let owner = await prisma.user.findUnique({ where: { email: dummyOwnerEmail } });
    if (!owner) {
      await auth.api.signUpEmail({
        body: { name: "Seed Owner", email: dummyOwnerEmail, password: "SeedOwner1!" },
      });
      owner = await prisma.user.findUniqueOrThrow({ where: { email: dummyOwnerEmail } });
    }

    const org = await auth.api.createOrganization({
      body: { name, slug, userId: owner.id },
    });

    await prisma.organization.update({
      where: { id: org.id },
      data: { portals: ["customer"] },
    });

    orgs.push({ id: org.id, name });
    console.log(`  Created org: ${name} (${slug})`);
  }

  return orgs;
}
