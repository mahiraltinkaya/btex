import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { verifyToken } from "../utils/token";
import { IUserDTO } from "../types/auth";
import { t } from "../i18n";

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ?? req.cookies.accessToken;

    if (!token) {
      return next(createError(401, t("AUTH_UNAUTHORIZED")));
    }
    const decodedToken = verifyToken(token);

    req.user = decodedToken as {
      role: string;
      id: string;
      email: string;
    };
    next();
  } catch (error) {
    console.error(error);
    next(createError(401, t("AUTH_FAILED")));
  }
};

export default authMiddleware;
