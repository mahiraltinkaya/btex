import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { prisma } from "../services/db-service";
import { TicketStatus } from "../types/ticket";
import { IUserDTO } from "../types/auth";
import { TransactionStatus } from "../generated/prisma/enums";
import { t } from "../i18n";

class BookingController {
  booking = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as IUserDTO;
    const { ticketId } = req.body;

    try {
      await prisma.$transaction(
        async (tx) => {
          const ticket = await tx.tickets.findUnique({
            where: {
              id: ticketId,
            },
          });
          if (!ticket) {
            throw createError(404, t("TICKET_NOT_FOUND"));
          }
          if (ticket.status !== TicketStatus.OPEN) {
            throw createError(409, t("TICKET_NOT_AVAILABLE"));
          }

          const event = await tx.events.findUnique({
            where: {
              id: ticket.eventId,
            },
          });

          if (!event) {
            throw createError(404, t("EVENT_NOT_FOUND"));
          }
          if (!event.isActive) {
            throw createError(410, t("EVENT_INACTIVE"));
          }

          await Promise.all([
            tx.tickets.update({
              where: {
                id: ticketId,
              },
              data: {
                status: TicketStatus.RESERVED,
                userId,
              },
            }),
            tx.transactions.create({
              data: {
                ticketId,
                eventId: ticket.eventId,
                amount: event.amount,
                userId,
              },
            }),
          ]);
        },
        { isolationLevel: "Serializable" },
      );

      res.json({ message: t("BOOKING_RESERVED") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("BOOKING_RESERVE_FAILED")));
    }
  };

  reserveByEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as IUserDTO;
    const { eventId } = req.body;

    try {
      await prisma.$transaction(
        async (tx) => {
          const event = await tx.events.findUnique({
            where: { id: eventId },
          });

          if (!event) {
            throw createError(404, t("EVENT_NOT_FOUND"));
          }
          if (!event.isActive) {
            throw createError(410, t("EVENT_INACTIVE"));
          }

          const ticket = await tx.tickets.findFirst({
            where: {
              eventId,
              status: TicketStatus.OPEN,
            },
            orderBy: { seatNumber: "asc" },
          });

          if (!ticket) {
            throw createError(409, t("EVENT_SOLD_OUT"));
          }

          await Promise.all([
            tx.tickets.update({
              where: { id: ticket.id },
              data: {
                status: TicketStatus.RESERVED,
                userId,
              },
            }),
            tx.transactions.create({
              data: {
                ticketId: ticket.id,
                eventId,
                amount: event.amount,
                userId,
              },
            }),
          ]);

          const remainingOpen = await tx.tickets.count({
            where: { eventId, status: TicketStatus.OPEN },
          });

          if (remainingOpen === 0) {
            await tx.events.update({
              where: { id: eventId },
              data: { isActive: false },
            });
          }
        },
        { isolationLevel: "Serializable" },
      );

      res.json({ message: t("BOOKING_RESERVED") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("BOOKING_RESERVE_FAILED")));
    }
  };

  cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as IUserDTO;
    const { ticketId } = req.body;

    try {
      await prisma.$transaction(
        async (tx) => {
          const ticket = await tx.tickets.findUnique({
            where: {
              id: ticketId,
            },
          });
          if (!ticket) {
            throw createError(404, t("TICKET_NOT_FOUND"));
          }
          if (ticket.status !== TicketStatus.RESERVED) {
            throw createError(409, t("TICKET_NOT_RESERVED"));
          }
          if (ticket.userId !== userId) {
            throw createError(403, t("TICKET_NOT_OWNED"));
          }

          const event = await tx.events.findUnique({
            where: {
              id: ticket.eventId,
            },
          });

          if (!event) {
            throw createError(404, t("EVENT_NOT_FOUND"));
          }
          if (!event.isActive) {
            throw createError(410, t("EVENT_INACTIVE"));
          }

          await Promise.all([
            tx.tickets.update({
              where: {
                id: ticketId,
              },
              data: {
                status: TicketStatus.OPEN,
                userId: null,
              },
            }),
            tx.transactions.deleteMany({
              where: {
                ticketId,
                userId,
                status: TransactionStatus.PENDING,
              },
            }),
          ]);
        },
        { isolationLevel: "Serializable" },
      );

      res.json({ message: t("BOOKING_CANCELLED") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("BOOKING_CANCEL_FAILED")));
    }
  };

  payment = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as IUserDTO;
    const { transactionId, cardNumber, expiry, cvv } = req.body;

    try {
      if (!this.validateCard(cardNumber, expiry, cvv)) {
        throw createError(422, t("PAYMENT_INVALID_CARD"));
      }

      await prisma.$transaction(
        async (tx) => {
          const transaction = await tx.transactions.findUnique({
            where: {
              id: transactionId,
            },
          });
          if (!transaction) {
            throw createError(404, t("TRANSACTION_NOT_FOUND"));
          }
          if (transaction.userId !== userId) {
            throw createError(403, t("TRANSACTION_NOT_OWNED"));
          }
          if (transaction.status !== TransactionStatus.PENDING) {
            throw createError(409, t("TRANSACTION_NOT_PENDING"));
          }

          const ticket = await tx.tickets.findUnique({
            where: {
              id: transaction.ticketId,
            },
          });

          if (!ticket) {
            throw createError(404, t("TICKET_NOT_FOUND"));
          }
          if (ticket.status !== TicketStatus.RESERVED) {
            throw createError(409, t("TICKET_NOT_RESERVED"));
          }

          await Promise.all([
            tx.tickets.update({
              where: {
                id: transaction.ticketId,
              },
              data: {
                status: TicketStatus.SOLD,
              },
            }),
            tx.transactions.update({
              where: {
                id: transactionId,
              },
              data: {
                status: TransactionStatus.COMPLETED,
              },
            }),
          ]);
        },
        { isolationLevel: "Serializable" },
      );

      res.json({ message: t("PAYMENT_SUCCESS") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("PAYMENT_FAILED")));
    }
  };

  private validateCard(
    cardNumber: string,
    expiry: string,
    cvv: string,
  ): boolean {
    if (!cardNumber || !expiry || !cvv) return false;

    const digits = cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(digits)) return false;

    let sum = 0;
    let alternate = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    if (sum % 10 !== 0) return false;

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
    const [monthStr, yearStr] = expiry.split("/");
    const month = parseInt(monthStr, 10);
    const year = 2000 + parseInt(yearStr, 10);
    const now = new Date();
    if (
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) return false;

    return true;
  }
}

const instance = new BookingController();
export default instance;
