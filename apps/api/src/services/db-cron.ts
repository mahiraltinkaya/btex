import cron from "node-cron";
import { prisma } from "./db-service";
import { TransactionStatus } from "../generated/prisma/enums";
import { TicketStatus } from "../types/ticket";

/**
 * RESERVED durumundaki ticket'ları 30 dakika sonra OPEN'a geri çevirir.
 *
 * - Schedule: Her 30 dakikada bir (`*​/30 * * * *`)
 * - Mantık: `updatedAt` 30 dakikadan eski ve `status = RESERVED` olan ticket'lar → OPEN
 */
async function resetReservedTickets(): Promise<void> {
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    try {
      await prisma.$transaction(
        async (tx) => {
          const transaciton = await tx.transactions.findMany({
            where: {
              createdAt: {
                lt: thirtyMinutesAgo,
              },
              status: TransactionStatus.PENDING,
            },
          });
          if (transaciton.length > 0) {
            await Promise.all([
              tx.transactions.deleteMany({
                where: {
                  id: {
                    in: transaciton.map((t) => t.id),
                  },
                },
              }),
              tx.tickets.updateMany({
                where: {
                  id: {
                    in: transaciton.map((t) => t.ticketId),
                  },
                },
                data: {
                  status: TicketStatus.OPEN,
                  userId: null,
                },
              }),
            ]);
            console.log(
              `✅ [db-cron] Reserved tickets reset successfully (attempt ${attempt})`,
            );
            return;
          }
          console.log("✅ [db-cron] No reserved tickets found");
        },
        { isolationLevel: "Serializable" },
      );
      return;
    } catch (error) {
      console.warn(
        `⚠️ [db-cron] Attempt ${attempt}/${MAX_RETRIES} failed:`,
        error instanceof Error ? error.message : error,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        console.error("❌ [db-cron] All retries exhausted, giving up.");
      }
    }
  }
}

/**
 * Tüm cron job'ları başlatır.
 * Uygulama başlarken `index.ts` içinden çağrılmalıdır.
 */
export function startCronJobs(): void {
  cron.schedule("*/30 * * * *", () => {
    console.log(
      `⏰ [db-cron] Running reserved ticket reset at ${new Date().toISOString()}`,
    );
    resetReservedTickets();
  });

  console.log("✅ [db-cron] Cron jobs scheduled successfully");
}
