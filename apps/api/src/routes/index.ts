import { Router } from "express";
import authRouter from "./auth";
import eventsRouter from "./events";
import bookingRouter from "./booking";
import monitorRouter from "./monitor";
import authMiddleware from "../middleware/auth-middleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", authMiddleware, eventsRouter);
router.use("/booking", authMiddleware, bookingRouter);
router.use("/monitor", authMiddleware, monitorRouter);

export default router;
