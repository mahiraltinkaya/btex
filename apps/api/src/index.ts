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
