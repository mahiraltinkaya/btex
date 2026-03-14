import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { prisma } from "../services/db-service";
import { t } from "../i18n";

class MonitorController {
  getEventMonitor = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const events = await prisma.eventMonitor.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(events);
    } catch (error) {
      console.error(error);
      next(createError(500, t("MONITOR_FAILED")));
    }
  };

  getEventMonitorById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return next(createError(400, t("VALIDATION_EVENT_ID_REQUIRED")));
      }
      const event = await prisma.eventMonitor.findUnique({
        where: { id },
      });
      if (!event) {
        return next(createError(404, t("EVENT_NOT_FOUND")));
      }
      res.json(event);
    } catch (error) {
      console.error(error);
      next(createError(500, t("MONITOR_FAILED")));
    }
  };
}

const instance = new MonitorController();
export default instance;
