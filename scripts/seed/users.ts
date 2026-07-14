import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

const SEED_USERS = 25;
const TEST_PASSWORD = "Test1234!";

export async function seedUsers(orgIds: string[]) {
  for (let i = 0; i < SEED_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`  Skipping ${email} (already exists)`);
      continue;
    }

    await auth.api.signUpEmail({ body: { name, email, password: TEST_PASSWORD } });
    await prisma.user.update({ where: { email }, data: { emailVerified: true } });

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    // Assign to a random customer org
    const organizationId = orgIds[Math.floor(Math.random() * orgIds.length)];
    const alreadyMember = await prisma.member.findFirst({
      where: { userId: user.id, organizationId },
    });
    if (!alreadyMember) {
      await prisma.member.create({
        data: { id: nanoid(), userId: user.id, organizationId, role: "member" },
      });
    }

    console.log(`  Created user: ${name} <${email}>`);
  }
}
