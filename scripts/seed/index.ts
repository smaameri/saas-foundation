import { seedOrganizations } from "./organizations";
import { seedUsers } from "./users";
import { intro, outro } from "@clack/prompts";
import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
  intro("Seeding test data");

  console.log("\nSeeding organizations...");
  const orgs = await seedOrganizations();

  console.log("\nSeeding users...");
  await seedUsers(orgs.map((o) => o.id));

  outro("Done! All test data seeded. Password for all users: Test1234!");
  await prisma.$disconnect();
}

void main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
