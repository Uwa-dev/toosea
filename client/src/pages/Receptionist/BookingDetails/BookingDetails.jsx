import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookingById,
  checkInGuest,
  cancelBooking,
} from "../../../services/bookingApi";
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

  const handleCheckIn = async () => {
    const confirmCheckIn = window.confirm(
      "Check in this guest?"
    );

    if (!confirmCheckIn) return;

    try {
      setActionLoading(true);

      const response = await checkInGuest(booking._id);

      alert(response.message);

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
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-loading">
          Loading booking...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-not-found">
          Booking not found.
        </div>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOutDate) -
      new Date(booking.checkInDate)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="booking-details-page">

      {/* Header */}

      <div className="booking-details-header">

        <button
          className="booking-details-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="booking-details-heading">
          <h2>Booking Details</h2>

          <p>
            View and manage booking information
          </p>
        </div>

      </div>

      {/* Information Cards */}

      <div className="booking-details-grid">

        {/* Apartment */}

        <div className="booking-details-card">

          <div className="booking-details-card-header">
            <h3>Apartment</h3>
          </div>

          <img
            className="booking-details-apartment-image"
            src={
              booking.apartment?.images?.[0]?.imageUrl ||
              "/toimages/room1.jpg"
            }
            alt={booking.apartment?.name || "Apartment"}
          />

          <div className="booking-details-info-list">

            <p>
              <strong>Name:</strong>
              <span>
                {booking.apartment?.name || "N/A"}
              </span>
            </p>

            <p>
              <strong>Location:</strong>
              <span>
                {booking.apartment?.location || "N/A"}
              </span>
            </p>

            <p>
              <strong>Price/Night:</strong>
              <span>
                ₦
                {booking.apartment?.pricePerNight?.toLocaleString() ||
                  "0"}
              </span>
            </p>

          </div>

        </div>

        {/* Guest Information */}

        <div className="booking-details-card">

          <div className="booking-details-card-header">
            <h3>Guest Information</h3>
          </div>

          <div className="booking-details-info-list">

            <p>
              <strong>Name:</strong>
              <span>
                {booking.customer?.fullName || "N/A"}
              </span>
            </p>

            <p>
              <strong>Email:</strong>
              <span>
                {booking.customer?.email || "N/A"}
              </span>
            </p>

            <p>
              <strong>Phone:</strong>
              <span>
                {booking.customer?.phone || "N/A"}
              </span>
            </p>

          </div>

        </div>

        {/* Booking Information */}

        <div className="booking-details-card">

          <div className="booking-details-card-header">
            <h3>Booking Information</h3>
          </div>

          <div className="booking-details-info-list">

            <p>
              <strong>Check In:</strong>
              <span>
                {new Date(
                  booking.checkInDate
                ).toLocaleDateString()}
              </span>
            </p>

            <p>
              <strong>Check Out:</strong>
              <span>
                {new Date(
                  booking.checkOutDate
                ).toLocaleDateString()}
              </span>
            </p>

            <p>
              <strong>Nights:</strong>
              <span>{nights}</span>
            </p>

            <p>
              <strong>Booking Source:</strong>
              <span>
                {booking.bookingSource || "N/A"}
              </span>
            </p>

          </div>

        </div>

        {/* Payment Information */}

        <div className="booking-details-card">

          <div className="booking-details-card-header">
            <h3>Payment</h3>
          </div>

          <div className="booking-details-info-list">

            <p>
              <strong>Total Amount:</strong>
              <span className="booking-details-total">
                ₦{booking.totalPrice?.toLocaleString() || "0"}
              </span>
            </p>

            <p>
              <strong>Method:</strong>
              <span>
                {booking.paymentMethod || "N/A"}
              </span>
            </p>

            <p>
              <strong>Payment Status:</strong>
              <span
                className={`booking-details-status booking-details-payment-${booking.paymentStatus?.toLowerCase()}`}
              >
                {booking.paymentStatus || "N/A"}
              </span>
            </p>

            <p>
              <strong>Booking Status:</strong>
              <span
                className={`booking-details-status booking-details-booking-${booking.bookingStatus?.toLowerCase()}`}
              >
                {booking.bookingStatus || "N/A"}
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* Actions */}

      <div className="booking-details-actions">

        {booking.bookingStatus === "CONFIRMED" && (
          <button
            className="booking-details-checkin-btn"
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
            className="booking-details-checkedin-btn"
          >
            ✓ Guest Checked In
          </button>
        )}

        {booking.bookingStatus === "EXPIRED" && (
          <button
            disabled
            className="booking-details-expired-btn"
          >
            Guest Stay Expired
          </button>
        )}

        {(booking.bookingStatus === "PENDING" ||
          booking.bookingStatus === "CONFIRMED") && (
          <button
            className="booking-details-cancel-btn"
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
            className="booking-details-cancelled-btn"
          >
            Booking Cancelled
          </button>
        )}

      </div>

    </div>
  );
};

export default BookingDetails;