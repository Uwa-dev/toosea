import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById, checkInGuest, cancelBooking } from "../../../services/bookingApi";
import "./bookingdetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const data = await getBookingById(id);

      setBooking(data);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Unable to load booking."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading booking...</h3>;
  }

  if (!booking) {
    return <h3>Booking not found.</h3>;
  }

  const handleCheckIn = async () => {
    const confirmCheckIn = window.confirm(
      "Check in this guest?"
    );

    if (!confirmCheckIn) return;

    try {
      setActionLoading(true);

      const response = await checkInGuest(booking._id);

      alert(response.message);

      // Refresh booking details
      await fetchBooking();

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to check in guest."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await cancelBooking(booking._id);

      alert(response.message);

      await fetchBooking();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to cancel booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const nights = Math.ceil(
    (new Date(booking.checkOutDate) -
      new Date(booking.checkInDate)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>

      <div>

        <button
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2>Booking Details</h2>

      </div>

      <div>

        {/* Apartment */}

        <div>

          <h3>Apartment</h3>

          <img
            src={
              booking.apartment?.images?.[0]?.imageUrl ||
              "/toimages/room1.jpg"
            }
            alt={booking.apartment?.name}
          />

          <p>
            <strong>Name:</strong>{" "}
            {booking.apartment?.name}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {booking.apartment?.location}
          </p>

          <p>
            <strong>Price/Night:</strong> ₦
            {booking.apartment?.pricePerNight?.toLocaleString()}
          </p>

        </div>

        {/* Guest */}

        <div>

          <h3>Guest Information</h3>

          <p>
            <strong>Name:</strong>{" "}
            {booking.customer.fullName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {booking.customer.email || "N/A"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {booking.customer.phone}
          </p>

        </div>

        {/* Booking */}

        <div>

          <h3>Booking Information</h3>

          <p>
            <strong>Check In:</strong>{" "}
            {new Date(
              booking.checkInDate
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Check Out:</strong>{" "}
            {new Date(
              booking.checkOutDate
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Nights:</strong>{" "}
            {nights}
          </p>

          <p>
            <strong>Booking Source:</strong>{" "}
            {booking.bookingSource}
          </p>

        </div>

        {/* Payment */}

        <div>

          <h3>Payment</h3>

          <p>
            <strong>Total Amount:</strong> ₦
            {booking.totalPrice.toLocaleString()}
          </p>

          <p>
            <strong>Method:</strong>{" "}
            {booking.paymentMethod}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {booking.paymentStatus}
          </p>

          <p>
            <strong>Booking Status:</strong>{" "}
            {booking.bookingStatus}
          </p>

        </div>

      </div>

      <div className="booking-actions">

        {booking.bookingStatus === "CONFIRMED" && (
          <button
            onClick={handleCheckIn}
            disabled={actionLoading}
          >
            {actionLoading
              ? "Checking In..."
              : "Check In Guest"}
          </button>
        )}

        {booking.bookingStatus === "CHECKED_IN" && (
          <button
            disabled
            className="checked-in-btn"
          >
            ✓ Guest Checked In
          </button>
        )}

        {booking.bookingStatus === "EXPIRED" && (
          <button
            disabled
            className="expired-btn"
          >
            Guest Stay Expired
          </button>
        )}

        {(booking.bookingStatus === "PENDING" ||
          booking.bookingStatus === "CONFIRMED") && (
          <button
            className="cancel-btn"
            disabled={actionLoading}
            onClick={handleCancelBooking}
          >
            {actionLoading
              ? "Cancelling..."
              : "Cancel Booking"}
          </button>
        )}

        {booking.bookingStatus === "CANCELLED" && (
          <button
            disabled
            className="cancelled-btn"
          >
            Booking Cancelled
          </button>
        )}

      </div>

    </div>
  );
};

export default BookingDetails;