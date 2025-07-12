import { Router } from "express";
import {
  addBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
} from "../controller/booking.controller";

const router = Router();

router.get("/", getBookings);
router.post("/", addBooking);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
