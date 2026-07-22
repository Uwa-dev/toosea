import Apartment from "../models/apartmentModel.js";
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Apartments
    const totalApartments = await Apartment.countDocuments();

    const availableApartments =
      await Apartment.countDocuments({
        isActive: true,
      });

    const occupiedApartments =
      totalApartments - availableApartments;

    // Staff
    const totalStaff = await User.countDocuments({
      role: {
        $in: ["OWNER", "MANAGER", "RECEPTIONIST"],
      },
    });

    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Monthly revenue
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const revenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          createdAt: {
            $gte: firstDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    res.json({
      success: true,

      dashboard: {
        totalApartments,

        availableApartments,

        occupiedApartments,

        totalStaff,

        todayBookings,

        monthlyRevenue:
          revenue.length > 0
            ? revenue[0].total
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};