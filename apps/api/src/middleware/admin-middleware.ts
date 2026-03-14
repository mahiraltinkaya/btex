import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { t } from "../i18n";

const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return next(createError(401, t("AUTH_FORBIDDEN")));
    }
    next();
  } catch (error) {
    console.error(error);
    next(createError(401, t("AUTH_FORBIDDEN")));
  }
};

export default adminMiddleware;
