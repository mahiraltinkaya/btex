import { prisma } from "../../src/services/db-service";

/**
 * PostgreSQL'de "event_monitor" view'ını oluşturur.
 * Prisma `db push` view oluşturmaz, bu script ile oluşturulmalıdır.
 *
 * Kullanım: npx ts-node prisma/seed/create-views.ts
 */
async function createViews(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE VIEW event_monitor AS
    SELECT
      e.id,
      e.name,
      e.type,
      e.capacity,
      e.amount,
      e."isActive"        AS is_active,
      COUNT(*) FILTER (WHERE t.status = 'OPEN')     AS open_tickets,
      COUNT(*) FILTER (WHERE t.status = 'RESERVED')  AS reserved_tickets,
      COUNT(*) FILTER (WHERE t.status = 'SOLD')      AS sold_tickets,
      COALESCE(
        SUM(e.amount) FILTER (WHERE t.status = 'SOLD'), 0
      )                                              AS total_revenue,
      CASE
        WHEN e.capacity = 0 THEN 0
        ELSE ROUND(
          (COUNT(*) FILTER (WHERE t.status IN ('RESERVED','SOLD')))::numeric
          / e.capacity * 100, 2
        )
      END                                            AS occupancy_rate,
      e."createdAt"       AS created_at
    FROM "Events" e
    LEFT JOIN "Tickets" t ON t."eventId" = e.id
    GROUP BY e.id;
  `);

  console.log("✅ View 'event_monitor' created successfully");
}

createViews()
  .catch((error) => {
    console.error("❌ Failed to create views:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
