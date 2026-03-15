import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { prisma } from "../services/db-service";
import { TicketStatus } from "../types/ticket";
import { t } from "../i18n";

class EventController {
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, type, amount, capacity, eventDate } = req.body;
      const ticketCount = capacity ?? 50;

      if (eventDate && new Date(eventDate) < new Date()) {
        return next(createError(400, t("EVENT_DATE_PAST")));
      }

      await prisma.$transaction(async (tx) => {
        const event = await tx.events.create({
          data: {
            name,
            description,
            type,
            amount,
            capacity: ticketCount,
            ...(eventDate && { eventDate: new Date(eventDate) }),
          },
        });
        await tx.tickets.createMany({
          data: Array.from({ length: ticketCount }, (_, i) => ({
            eventId: event.id,
            ticketCode: `${event.id}-${i + 1}`,
            status: TicketStatus.OPEN,
            seatNumber: i + 1,
          })),
        });
      });

      res.json({ message: t("EVENT_CREATED") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("EVENT_CREATE_FAILED")));
    }
  };
  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, description, type, amount, capacity, eventDate } =
        req.body;

      if (!id) {
        return next(createError(400, t("VALIDATION_EVENT_ID_REQUIRED")));
      }

      if (eventDate && new Date(eventDate) < new Date()) {
        return next(createError(400, t("EVENT_DATE_PAST")));
      }

      let finalCapacity: number | undefined = capacity;

      await prisma.$transaction(
        async (tx) => {
          const currentEvent = await tx.events.findUnique({
            where: { id },
          });

          if (!currentEvent) {
            throw createError(404, t("EVENT_NOT_FOUND"));
          }

          const oldCapacity = currentEvent.capacity;

          if (capacity !== undefined && capacity !== oldCapacity) {
            if (capacity > oldCapacity) {
              const allTickets = await tx.tickets.findMany({
                where: { eventId: id },
                select: { seatNumber: true },
              });
              const lastSeat =
                allTickets.length > 0
                  ? Math.max(...allTickets.map((t) => t.seatNumber))
                  : 0;
              const diff = capacity - oldCapacity;

              await tx.tickets.createMany({
                data: Array.from({ length: diff }, (_, i) => ({
                  eventId: id,
                  ticketCode: `${id}-${lastSeat + i + 1}`,
                  status: TicketStatus.OPEN,
                  seatNumber: lastSeat + i + 1,
                })),
              });
            } else {
              const diff = oldCapacity - capacity;
              const openTickets = await tx.tickets.findMany({
                where: { eventId: id, status: TicketStatus.OPEN },
                select: { id: true, seatNumber: true },
              });

              const sortedDesc = openTickets.sort(
                (a, b) => b.seatNumber - a.seatNumber,
              );

              const deleteCount = Math.min(diff, openTickets.length);
              const ticketsToDelete = sortedDesc.slice(0, deleteCount);

              await tx.tickets.deleteMany({
                where: { id: { in: ticketsToDelete.map((t) => t.id) } },
              });

              if (openTickets.length < diff) {
                finalCapacity = oldCapacity - openTickets.length;
              }
            }
          }

          await tx.events.update({
            where: { id },
            data: {
              name,
              description,
              type,
              ...(amount !== undefined && { amount }),
              ...(eventDate !== undefined && {
                eventDate: eventDate ? new Date(eventDate) : null,
              }),
              ...(finalCapacity !== undefined && { capacity: finalCapacity }),
            },
          });
        },
        { isolationLevel: "Serializable" },
      );

      res.json({ message: t("EVENT_UPDATED") });
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      if (error instanceof Error && error.message.startsWith("Kapasite")) {
        next(createError(400, error.message));
      } else {
        next(createError(500, t("EVENT_UPDATE_FAILED")));
      }
    }
  };
  deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;

    if (!id) {
      return next(createError(400, t("VALIDATION_EVENT_ID_REQUIRED")));
    }

    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const activeTicketCount = await tx.tickets.count({
            where: {
              eventId: id,
              status: { in: [TicketStatus.SOLD, TicketStatus.RESERVED] },
            },
          });

          if (activeTicketCount > 0) {
            await tx.events.update({
              where: { id },
              data: { isActive: false },
            });

            return {
              deleted: false,
              message: t("EVENT_HAS_ACTIVE_TICKETS"),
            };
          }

          await tx.tickets.deleteMany({ where: { eventId: id } });
          await tx.events.delete({ where: { id } });

          return { deleted: true, message: t("EVENT_DELETED") };
        },
        { isolationLevel: "Serializable" },
      );

      if (result.deleted) {
        res.json({ message: result.message });
      } else {
        res.json({ message: result.message, isActive: false });
      }
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("EVENT_DELETE_FAILED")));
    }
  };
  getEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      if (!id) {
        return next(createError(400, t("VALIDATION_EVENT_ID_REQUIRED")));
      }
      const event = await prisma.events.findUnique({
        where: {
          id,
        },
      });
      if (!event) {
        return next(createError(404, t("EVENT_NOT_FOUND")));
      }
      res.json(event);
    } catch (error) {
      if (error && typeof error === "object" && "statusCode" in error) {
        return next(error);
      }
      console.error(error);
      next(createError(500, t("EVENT_GET_FAILED")));
    }
  };
  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 10),
      );
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prisma.events.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.events.count(),
      ]);

      res.json({
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error(error);
      next(createError(500, t("EVENT_GET_ALL_FAILED")));
    }
  };

  getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { id: string; role: string };
      const isAdmin = user.role === "ADMIN";
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 10),
      );
      const eventId = req.query.eventId as string | undefined;
      const skip = (page - 1) * limit;

      const where = {
        ...(isAdmin ? {} : { userId: user.id }),
        ...(eventId ? { eventId } : {}),
      };

      const [tickets, total] = await Promise.all([
        prisma.tickets.findMany({
          where,
          include: {
            event: {
              select: { name: true },
            },
            transactions: {
              select: { id: true, status: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.tickets.count({ where }),
      ]);

      const data = tickets.map((ticket) => ({
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        seatNumber: ticket.seatNumber,
        status: ticket.status,
        eventId: ticket.eventId,
        userId: ticket.userId,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        event: { name: ticket.event.name },
        transaction: ticket.transactions[0]
          ? {
              id: ticket.transactions[0].id,
              status: ticket.transactions[0].status,
            }
          : null,
      }));

      res.json({
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error(error);
      next(createError(500, t("TICKET_GET_ALL_FAILED")));
    }
  };
}

const instance = new EventController();
export default instance;
