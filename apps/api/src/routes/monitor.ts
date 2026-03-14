import { Router } from "express";
import monitorController from "../controllers/monitor-controller";

const router = Router();

router.get("/events", monitorController.getEventMonitor);
router.get("/events/:id", monitorController.getEventMonitorById);

export default router;
