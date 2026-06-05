import express from "express";

import {
  createOnlineBooking,
  createWalkInBooking,
  getTodayBookings,
  getAllBookings,
  checkInGuest,
  checkOutGuest,
  cancelBooking
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const BookingRouter = express.Router();

BookingRouter.post("/online", createOnlineBooking);
BookingRouter.post("/walkin", protect, authorizeRoles("RECEPTIONIST"), createWalkInBooking);
BookingRouter.get("/today", protect, authorizeRoles("OWNER", "MANAGER", "RECEPTIONIST"), getTodayBookings);
BookingRouter.get("/", protect, authorizeRoles("OWNER", "MANAGER"), getAllBookings);
BookingRouter.patch("/:id/checkin", protect, authorizeRoles("RECEPTIONIST"), checkInGuest);
BookingRouter.patch("/:id/checkout", protect, authorizeRoles("RECEPTIONIST"), checkOutGuest);
BookingRouter.patch("/:id/cancel", protect, authorizeRoles("OWNER", "MANAGER"), cancelBooking);

export default BookingRouter



// router.post(
//   "/:id/images",
//   protect,
//   authorizeRoles("OWNER"),
//   upload.array("images", 15),
//   uploadApartmentImages
// );

// router.delete(
//   "/:id/images/:publicId",
//   protect,
//   authorizeRoles("OWNER"),
//   deleteApartmentImage
// );