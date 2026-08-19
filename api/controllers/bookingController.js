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

    await Apartment.findByIdAndUpdate(apartmentId, {
      status: "BOOKED",
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
      createdBy: req.user.id,
      customer,
      checkInDate,
      checkOutDate,
      totalPrice,
      bookingSource: "WALK_IN",
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED"
    });

    await Apartment.findByIdAndUpdate(apartmentId, {
      status: "BOOKED",
    });

    res.status(201).json({
      success: true,
      message: "Walk-in booking created successfully.",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getTodayBookings = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    // Include yesterday
    const previousDay = new Date(start);
    previousDay.setDate(previousDay.getDate() - 1);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      checkInDate: {
        $gte: previousDay,
        $lte: end,
      },
      bookingStatus: {
        $in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
      },
    })
      .populate("apartment")
      .sort({ checkInDate: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("apartment");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkInGuest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "CONFIRMED") {
      return res.status(400).json({
        message: "Only confirmed bookings can be checked in.",
      });
    }

    booking.bookingStatus = "CHECKED_IN";
    booking.checkedInAt = new Date();
    await booking.save();

    await Apartment.findByIdAndUpdate(
      booking.apartment,
      {
        status: "OCCUPIED",
      }
    );

    res.status(200).json({
      success: true,
      message: "Guest checked in successfully.",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkOutGuest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.bookingStatus !== "CHECKED_IN" &&
      booking.bookingStatus !== "EXPIRED"
    ) {
      return res.status(400).json({
        message: "Guest is not currently checked in.",
      });
    }

    booking.bookingStatus = "CHECKED_OUT";
    booking.checkedOutAt = new Date();
    await booking.save();

    await Apartment.findByIdAndUpdate(
      booking.apartment,
      {
        status: "AVAILABLE",
      }
    );

    res.status(200).json({
      success: true,
      message: "Guest checked out successfully.",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Cannot cancel after guest has checked in
    if (
      booking.bookingStatus === "CHECKED_IN" ||
      booking.bookingStatus === "EXPIRED" ||
      booking.bookingStatus === "CHECKED_OUT"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This booking cannot be cancelled because the guest has already checked in.",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking has already been cancelled.",
      });
    }

    booking.bookingStatus = "CANCELLED";
    await booking.save();

    // Make the apartment available again
    await Apartment.findByIdAndUpdate(
      booking.apartment,
      {
        status: "AVAILABLE",
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCheckedInGuests = async (req, res) => {
  try {
    const bookings = await Booking.find({
      bookingStatus: {
        $in: ["CHECKED_IN", "EXPIRED"],
      },
    })
    .populate("apartment")
    .sort({
      bookingStatus: -1,
      checkOutDate: 1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const transferAndExtendStay = async (req, res) => {
  try {
    const {
      newApartmentId,
      newCheckOutDate,
      paymentMethod,
    } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("apartment");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.bookingStatus !== "CHECKED_IN" &&
      booking.bookingStatus !== "EXPIRED"
    ) {
      return res.status(400).json({
        message:
          "Only checked-in or expired guests can be transferred.",
      });
    }

    const newApartment = await Apartment.findById(
      newApartmentId
    );

    if (!newApartment) {
      return res.status(404).json({
        message: "New apartment not found.",
      });
    }

    if (
      newApartment.status !== "AVAILABLE"
    ) {
      return res.status(400).json({
        message:
          "Selected apartment is not available.",
      });
    }

    // Check if another booking already exists
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },

      apartment: newApartmentId,

      bookingStatus: {
        $nin: [
          "CANCELLED",
          "CHECKED_OUT",
        ],
      },

      checkInDate: {
        $lt: new Date(newCheckOutDate),
      },

      checkOutDate: {
        $gt: booking.checkOutDate,
      },
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "Selected apartment already has a booking.",
      });
    }

    const extraNights = Math.ceil(
      (new Date(newCheckOutDate) -
        booking.checkOutDate) /
        (1000 * 60 * 60 * 24)
    );

    const additionalAmount =
      extraNights *
      newApartment.pricePerNight;

    // Free old apartment
    await Apartment.findByIdAndUpdate(
      booking.apartment._id,
      {
        status: "AVAILABLE",
      }
    );

    // Occupy new apartment
    await Apartment.findByIdAndUpdate(
      newApartmentId,
      {
        status: "OCCUPIED",
      }
    );

    booking.apartment = newApartmentId;

    booking.checkOutDate =
      newCheckOutDate;

    booking.totalPrice +=
      additionalAmount;

    booking.paymentMethod =
      paymentMethod;

    booking.bookingStatus =
      "CHECKED_IN";

    await booking.save();

    res.status(200).json({
      success: true,
      message:
        "Guest transferred successfully.",
      booking,
      extraNights,
      additionalAmount,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMonthlyBookings = async (req, res) => {
  try {
    const { year, month } = req.query;

    const selectedYear = Number(year);
    const selectedMonth = Number(month);

    if (!selectedYear || !selectedMonth) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required.",
      });
    }

    if (selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12.",
      });
    }

    // Start of selected month
    const startDate = new Date(
      selectedYear,
      selectedMonth - 1,
      1,
      0,
      0,
      0,
      0
    );

    // Start of next month
    const endDate = new Date(
      selectedYear,
      selectedMonth,
      1,
      0,
      0,
      0,
      0
    );

    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("apartment")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      year: selectedYear,
      month: selectedMonth,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getYearlyBookings = async (req, res) => {
  try {
    const { year } = req.query;

    const selectedYear = Number(year);

    if (!selectedYear) {
      return res.status(400).json({
        success: false,
        message: "Year is required.",
      });
    }

    const startDate = new Date(
      selectedYear,
      0,
      1,
      0,
      0,
      0,
      0
    );

    const endDate = new Date(
      selectedYear + 1,
      0,
      1,
      0,
      0,
      0,
      0
    );

    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("apartment")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      year: selectedYear,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};