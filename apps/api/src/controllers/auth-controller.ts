import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { prisma } from "../services/db-service";
import argon2 from "argon2";
import { createToken, verifyToken } from "../utils/token";
import { IUserDTO } from "../types/auth";
import { z } from "zod";
import { t } from "../i18n";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? ("strict" as const) : ("lax" as const),
};

const registerSchema = z.object({
  email: z.email(t("VALIDATION_EMAIL")),
  password: z.string().min(6, t("VALIDATION_PASSWORD_MIN")),
  firstName: z.string().min(1, t("VALIDATION_FIRST_NAME_REQUIRED")).optional(),
  lastName: z.string().min(1, t("VALIDATION_LAST_NAME_REQUIRED")).optional(),
});

const loginSchema = z.object({
  email: z.email(t("VALIDATION_EMAIL")),
  password: z.string().min(1, t("VALIDATION_PASSWORD_REQUIRED")),
});

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const message = parsed.error.issues
          .map((e: { message: string }) => e.message)
          .join(", ");
        return next(createError(400, message));
      }

      const { email, password, firstName, lastName } = parsed.data;
      const hashedPassword = await argon2.hash(password);

      let user;
      try {
        user = await prisma.users.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
          },
        });
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code: string }).code === "P2002"
        ) {
          return res.status(409).json({ error: t("AUTH_USER_EXISTS") });
        }
        throw error;
      }

      const { token, refreshToken } = await this.generateAuthData(
        user as IUserDTO,
      );

      res.cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", token, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
      });

      const { password: _, ...safeUser } = user;

      res.json({ user: safeUser, accessToken: token });
    } catch (error) {
      console.error(error);
      next(createError(500, t("AUTH_REGISTER_FAILED")));
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        const message = parsed.error.issues
          .map((e: { message: string }) => e.message)
          .join(", ");
        return next(createError(400, message));
      }

      const { email, password } = parsed.data;
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return next(createError(404, t("AUTH_USER_NOT_FOUND")));
      }
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return next(createError(401, t("AUTH_INVALID_PASSWORD")));
      }

      const { token, refreshToken } = await this.generateAuthData(
        user as IUserDTO,
      );

      res.cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", token, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
      });

      const { password: _, ...safeUser } = user;

      res.json({ user: safeUser, accessToken: token });
    } catch (error) {
      console.error(error);
      next(createError(500, t("AUTH_LOGIN_FAILED")));
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existRefreshToken = req.cookies.refreshToken;
      if (!existRefreshToken) {
        return next(createError(401, t("AUTH_REFRESH_TOKEN_NOT_FOUND")));
      }

      let decodedToken;
      try {
        decodedToken = verifyToken(existRefreshToken);
      } catch {
        return next(createError(401, t("AUTH_REFRESH_TOKEN_INVALID")));
      }

      const user = await prisma.users.findUnique({
        where: {
          id: decodedToken.id,
        },
      });
      if (!user) {
        return next(createError(404, t("AUTH_USER_NOT_FOUND")));
      }

      const { token, refreshToken } = await this.generateAuthData(
        user as IUserDTO,
      );

      res.cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", token, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
      });

      const { password: _, ...safeUser } = user;

      res.json({ user: safeUser, accessToken: token });
    } catch (error) {
      console.error(error);
      next(createError(500, t("AUTH_REFRESH_TOKEN_FAILED")));
    }
  };

  private async generateAuthData(
    user: IUserDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = createToken(
      { id: user.id, email: user.email, role: user.role },
      "7d",
    );
    return { token, refreshToken };
  }
}

const instance = new AuthController();
export default instance;
