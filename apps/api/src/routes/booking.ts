import { Router } from "express";
import bookingController from "../controllers/booking-controller";

const router = Router();

router.post("/booking", bookingController.booking);
router.post("/reserve-by-event", bookingController.reserveByEvent);

router.post("/cancel", bookingController.cancelBooking);

router.post("/payment", bookingController.payment);

export default router;
