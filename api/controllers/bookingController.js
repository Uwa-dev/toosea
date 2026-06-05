import Booking from "../models/bookingModel.js";
import Apartment from "../models/apartmentModel.js";
import {validateCustomer, normalizePhone} from "../utils/validateCustomer.js";

const hasBookingConflict = async (
  apartmentId,
  checkInDate,
  checkOutDate
) => {
  const conflict = await Booking.findOne({
    apartment: apartmentId,

    bookingStatus: {
      $nin: ["CANCELLED", "CHECKED_OUT"]
    },

    checkInDate: {
      $lt: new Date(checkOutDate)
    },

    checkOutDate: {
      $gt: new Date(checkInDate)
    }
  });

  return !!conflict;
};

export const createOnlineBooking = async (req, res) => {
  try {
    const {
      apartmentId,
      customer,
      checkInDate,
      checkOutDate
    } = req.body;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found"
      });
    }

    const customerData = {
      fullName: customer.fullName,
      email: customer.email || null,
      phone: customer.phone
        ? normalizePhone(customer.phone)
        : null
    };

    // validate
    validateCustomer(customerData);

    const conflict = await hasBookingConflict(
      apartmentId,
      checkInDate,
      checkOutDate
    );

    if (conflict) {
      return res.status(409).json({
        message: "Apartment already booked"
      });
    }

    const nights =
      Math.ceil(
        (new Date(checkOutDate) -
          new Date(checkInDate)) /
          (1000 * 60 * 60 * 24)
      );

    const totalPrice =
      nights * apartment.pricePerNight;

    const booking = await Booking.create({
      apartment: apartmentId,

      customer: customerData,

      checkInDate,
      checkOutDate,

      totalPrice,

      bookingSource: "ONLINE",

      paymentMethod: "PAYSTACK",

      bookingStatus: "PENDING",

      paymentStatus: "PENDING"
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const createWalkInBooking = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "RECEPTIONIST") {
      return res.status(403).json({
        message:
          "Only receptionists can create walk-in bookings"
      });
    }

    const {
      apartmentId,
      customer,
      checkInDate,
      checkOutDate,
      paymentMethod
    } = req.body;

    const apartment = await Apartment.findById(
      apartmentId
    );

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found"
      });
    }

    const conflict = await hasBookingConflict(
      apartmentId,
      checkInDate,
      checkOutDate
    );

    if (conflict) {
      return res.status(409).json({
        message: "Apartment already booked"
      });
    }

    const nights =
      Math.ceil(
        (new Date(checkOutDate) -
          new Date(checkInDate)) /
          (1000 * 60 * 60 * 24)
      );

    const totalPrice =
      nights * apartment.pricePerNight;

    const booking = await Booking.create({
      apartment: apartmentId,

      customer,

      checkInDate,
      checkOutDate,

      totalPrice,

      bookingSource: "WALK_IN",

      paymentMethod,

      paymentStatus: "PAID",

      bookingStatus: "CONFIRMED"
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getTodayBookings = async (
  req,
  res
) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    })
      .populate("apartment")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAllBookings = async (
  req,
  res
) => {
  try {
    const bookings = await Booking.find()
      .populate("apartment")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const checkInGuest = async (
  req,
  res
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.bookingStatus = "CHECKED_IN";

    await booking.save();

    res.json({
      message: "Guest checked in",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const checkOutGuest = async (
  req,
  res
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.bookingStatus = "CHECKED_OUT";

    await booking.save();

    res.json({
      message: "Guest checked out",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const cancelBooking = async (
  req,
  res
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.bookingStatus = "CANCELLED";

    await booking.save();

    res.json({
      message: "Booking cancelled"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

