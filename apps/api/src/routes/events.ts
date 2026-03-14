import { Router } from "express";
import eventController from "../controllers/event-controller";
import adminMiddleware from "../middleware/admin-middleware";

const router = Router();

router.get("/get/:id", eventController.getEvent);
router.get("/get-all", eventController.getAllEvents);
router.get("/get-all-tickets", eventController.getAllTickets);
router.post("/create", [adminMiddleware], eventController.createEvent);
router.put("/update", [adminMiddleware], eventController.updateEvent);
router.delete("/delete", [adminMiddleware], eventController.deleteEvent);

export default router;
