import cron from "node-cron";
import { prisma } from "./db-service";
import { TransactionStatus } from "../generated/prisma/enums";
import { TicketStatus } from "../types/ticket";

// ─── Types ───────────────────────────────────────────────────────────

type ReservationEntry = {
  transactionId: string;
  ticketId: string;
  expiresAt: number; // Unix timestamp (ms) — createdAt + 30 dk
};

// ─── In-Memory Store ─────────────────────────────────────────────────

const pendingReservations = new Map<string, ReservationEntry>();

const RESERVATION_TTL_MS = 30 * 60 * 1000; // 30 dakika
const MAX_RETRIES = 3;

// ─── Layer 1: DB Scanner (her 10 dk) ────────────────────────────────

/**
 * DB'den 30 dakikayı aşmış PENDING transaction'ları çeker ve Map'e ekler.
 * Zaten Map'te olan entry'ler tekrar eklenmez (idempotent).
 */
async function scanExpiredReservations(): Promise<void> {
  const thirtyMinutesAgo = new Date(Date.now() - RESERVATION_TTL_MS);

  try {
    const expiredTransactions = await prisma.transactions.findMany({
      where: {
        createdAt: { lt: thirtyMinutesAgo },
        status: TransactionStatus.PENDING,
      },
      select: {
        id: true,
        ticketId: true,
        createdAt: true,
      },
    });

    let newEntries = 0;
    for (const tx of expiredTransactions) {
      if (!pendingReservations.has(tx.id)) {
        pendingReservations.set(tx.id, {
          transactionId: tx.id,
          ticketId: tx.ticketId,
          expiresAt: tx.createdAt.getTime() + RESERVATION_TTL_MS,
        });
        newEntries++;
      }
    }

    if (newEntries > 0) {
      console.log(
        `🗺️ [db-cron] Scan complete: ${newEntries} new expired reservations added to map (total: ${pendingReservations.size})`,
      );
    } else {
      console.log(
        `🗺️ [db-cron] Scan complete: no new expired reservations found (map size: ${pendingReservations.size})`,
      );
    }
  } catch (error) {
    console.error(
      "❌ [db-cron] DB scan failed:",
      error instanceof Error ? error.message : error,
    );
  }
}

// ─── Layer 2: Single Reservation Reset ──────────────────────────────

/**
 * Tek bir reservation'ı resetler.
 * Önce transaction'ın hâlâ PENDING olup olmadığını kontrol eder.
 * - PENDING ise: Transaction silinir, Ticket OPEN'a döner.
 * - PENDING değilse (COMPLETED vb.): Ticket'a dokunulmaz, sadece Map'ten düşer.
 * Retry mekanizması ile 3 deneme yapılır.
 */
async function resetSingleReservation(entry: ReservationEntry): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await prisma.$transaction(
        async (tx) => {
          const transaction = await tx.transactions.findUnique({
            where: { id: entry.transactionId },
            select: { status: true },
          });

          if (
            !transaction ||
            transaction.status !== TransactionStatus.PENDING
          ) {
            console.log(
              `⏭️ [db-cron] Skipping transaction=${entry.transactionId} (status: ${transaction?.status ?? "NOT_FOUND"})`,
            );
            return;
          }
          await Promise.all([
            tx.transactions.delete({
              where: { id: entry.transactionId },
            }),
            tx.tickets.update({
              where: { id: entry.ticketId },
              data: {
                status: TicketStatus.OPEN,
                userId: null,
              },
            }),
          ]);

          console.log(
            `✅ [db-cron] Reservation reset: transaction=${entry.transactionId} ticket=${entry.ticketId}`,
          );
        },
        { isolationLevel: "Serializable" },
      );
      return;
    } catch (error) {
      console.warn(
        `⚠️ [db-cron] Reset attempt ${attempt}/${MAX_RETRIES} failed for transaction=${entry.transactionId}:`,
        error instanceof Error ? error.message : error,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        console.error(
          `❌ [db-cron] All retries exhausted for transaction=${entry.transactionId}`,
        );
      }
    }
  }
}

// ─── Layer 2: Map Checker (her saniye) ──────────────────────────────

/**
 * Map'teki entry'leri kontrol eder. expiresAt'ı geçmiş olanları resetler.
 * Her entry işlem sonrası (başarılı/başarısız) Map'ten kaldırılır.
 * Başarısız olanlar 10 dk sonraki DB scan'de tekrar yakalanır.
 */
function processExpiredReservations(): void {
  const now = Date.now();

  for (const [key, entry] of pendingReservations) {
    if (now >= entry.expiresAt) {
      pendingReservations.delete(key);
      resetSingleReservation(entry).catch((error) => {
        console.error(
          `❌ [db-cron] Unexpected error processing transaction=${entry.transactionId}:`,
          error instanceof Error ? error.message : error,
        );
      });
    }
  }
}

// ─── Startup ─────────────────────────────────────────────────────────

/**
 * Tüm cron job'ları ve interval'ları başlatır.
 * Uygulama başlarken `index.ts` içinden çağrılmalıdır.
 *
 * Mimari:
 * - Layer 1: Her 10 dk'da DB scan → süresi dolmuş PENDING transaction'ları Map'e ekler
 * - Layer 2: Her saniye Map kontrolü → expiresAt geçmiş entry'leri resetler
 * - Boot'ta anında ilk scan çalışır (10 dk beklenmez)
 */
export function startCronJobs(): void {
  cron.schedule("*/10 * * * *", () => {
    console.log(
      `⏰ [db-cron] Running reservation scan at ${new Date().toISOString()}`,
    );
    scanExpiredReservations();
  });

  setInterval(processExpiredReservations, 30000);

  console.log("⏰ [db-cron] Running initial reservation scan on boot...");
  scanExpiredReservations();

  console.log(
    "✅ [db-cron] Cron jobs & interval timers scheduled successfully",
  );
}
