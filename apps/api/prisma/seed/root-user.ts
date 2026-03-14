import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedRootUser() {
  const email = "admin@btex.com";
  const rawPassword = "135790Test*";

  const hashedPassword = await argon2.hash(rawPassword);

  const user = await prisma.users.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  console.log(`✅ Root admin user seeded: ${user.email} (${user.id})`);
}

seedRootUser()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
