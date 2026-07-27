import express from "express";

import {
  createOnlineBooking,
  createWalkInBooking,
  getTodayBookings,
  getAllBookings,
  getBookingById,
  checkInGuest,
  checkOutGuest,
  cancelBooking,
  getCheckedInGuests,
  transferAndExtendStay
} from "../controllers/bookingController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const BookingRouter = express.Router();

BookingRouter.post("/online", createOnlineBooking);
BookingRouter.post("/walkin", protect, authorizeRoles("RECEPTIONIST"), createWalkInBooking);
BookingRouter.get("/today", protect, authorizeRoles("OWNER", "MANAGER", "RECEPTIONIST"), getTodayBookings);
BookingRouter.get("/", protect, authorizeRoles("OWNER", "MANAGER"), getAllBookings);
BookingRouter.get("/checkedin", protect, authorizeRoles("OWNER", "MANAGER", "RECEPTIONIST"), getCheckedInGuests);
BookingRouter.get("/:id", protect, authorizeRoles("OWNER", "MANAGER", "RECEPTIONIST"), getBookingById)
BookingRouter.patch("/:id/checkin", protect, authorizeRoles("RECEPTIONIST"), checkInGuest);
BookingRouter.patch("/:id/checkout", protect, authorizeRoles("RECEPTIONIST"), checkOutGuest);
BookingRouter.patch("/:id/cancel", protect, authorizeRoles("OWNER", "MANAGER"), cancelBooking);
BookingRouter.patch("/:id/transfer",  protect, authorizeRoles("RECEPTIONIST"), transferAndExtendStay);

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