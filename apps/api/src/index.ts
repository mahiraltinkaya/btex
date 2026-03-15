import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { startCronJobs } from "./services/db-cron";
import { t } from "./i18n";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: t("RATE_LIMIT") },
});

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const colorCode =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
          ? "\x1b[33m"
          : status >= 300
            ? "\x1b[36m"
            : "\x1b[32m";

    const methodColors: Record<string, string> = {
      GET: "\x1b[36m",
      POST: "\x1b[33m",
      PUT: "\x1b[35m",
      PATCH: "\x1b[35m",
      DELETE: "\x1b[31m",
    };

    const methodColor = methodColors[req.method] || "\x1b[37m";
    const reset = "\x1b[0m";
    const dim = "\x1b[2m";

    console.info(
      `${dim}${new Date().toLocaleTimeString()}${reset} ${methodColor}${req.method.padEnd(7)}${reset} ${req.originalUrl} ${colorCode}${status}${reset} ${dim}${duration}ms${reset}`,
    );
  });

  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(
  (
    error: Error & { statusCode?: number; status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const statusCode = error.statusCode || error.status || 500;
    res
      .status(statusCode)
      .json({ message: error.message || t("INTERNAL_SERVER_ERROR") });
  },
);

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  startCronJobs();
});

export default app;
