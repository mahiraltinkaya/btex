import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Mock Event Data (capacity: 30 each) ────────────────

const SEED_EVENTS = [
  {
    name: "Summer Beats Festival",
    description:
      "Experience the best of Summer Beats Festival. An unforgettable event featuring top-tier performances and electrifying energy.",
    type: "FESTIVAL" as const,
    amount: 150,
  },
  {
    name: "Rock Arena Night",
    description:
      "Experience the best of Rock Arena Night. An unforgettable event featuring top-tier rock bands and live performances.",
    type: "CONCERT" as const,
    amount: 85,
  },
  {
    name: "Tech Innovators 2026",
    description:
      "Experience the best of Tech Innovators 2026. Cutting-edge technology conference with world-class speakers.",
    type: "CONFERENCE" as const,
    amount: 200,
  },
  {
    name: "Jazz Under the Stars",
    description:
      "Experience the best of Jazz Under the Stars. A magical evening of jazz music under the open sky.",
    type: "CONCERT" as const,
    amount: 120,
  },
  {
    name: "Comedy Carnival",
    description:
      "Experience the best of Comedy Carnival. A night full of laughter with top comedians from around the world.",
    type: "OTHER" as const,
    amount: 45,
  },
  {
    name: "Electronic Dreams",
    description:
      "Experience the best of Electronic Dreams. The ultimate electronic music festival with world-renowned DJs.",
    type: "FESTIVAL" as const,
    amount: 95,
  },
];

const CAPACITY = 10;

async function seedEvents() {
  console.log(
    `\n🌱 Seeding ${SEED_EVENTS.length} events (${CAPACITY} tickets each)...\n`,
  );

  for (const eventData of SEED_EVENTS) {
    // Idempotent: check if event with this name already exists
    const existing = await prisma.events.findFirst({
      where: { name: eventData.name },
    });

    if (existing) {
      console.log(`  ⏭️  "${existing.name}" already exists (${existing.id})`);
      continue;
    }

    // Create event + tickets in a transaction
    await prisma.$transaction(async (tx) => {
      const event = await tx.events.create({
        data: {
          name: eventData.name,
          description: eventData.description,
          type: eventData.type,
          amount: eventData.amount,
          capacity: CAPACITY,
        },
      });

      await tx.tickets.createMany({
        data: Array.from({ length: CAPACITY }, (_, i) => ({
          eventId: event.id,
          ticketCode: `${event.id}-${i + 1}`,
          status: "OPEN" as const,
          seatNumber: i + 1,
        })),
      });

      console.log(`  ✅ "${event.name}" → ${CAPACITY} tickets (${event.id})`);
    });
  }

  console.log(`\n✅ Event seed completed.\n`);
}

seedEvents()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
