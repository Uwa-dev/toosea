import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },

    checkInDate: Date,
    checkOutDate: Date,

    totalPrice: Number,

    bookedBy: {
      type: String,
      enum: ["guest", "receptionist"]
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending" // Pending until payment is confirmed
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;