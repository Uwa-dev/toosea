import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  X,
  AlertTriangle,
  LogIn,
  CalendarX,
} from "lucide-react";

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

  const [confirmationModal, setConfirmationModal] = useState(null);

  // FETCH BOOKING
  const fetchBooking = async () => {
    try {
      setLoading(true);

      const data = await getBookingById(id);

      setBooking(data);
    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Unable to load booking."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // OPEN CONFIRMATION MODAL
  const openConfirmationModal = (action) => {
    setConfirmationModal(action);
  };

  // CLOSE CONFIRMATION MODAL
  const closeConfirmationModal = () => {
    if (actionLoading) return;

    setConfirmationModal(null);
  };

  // CHECK IN GUEST
  const handleCheckIn = async () => {
    if (!booking) return;

    try {
      setActionLoading(true);

      const response = await checkInGuest(booking._id);

      toast.info(response.message);

      setConfirmationModal(null);

      await fetchBooking();
    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Unable to check in guest."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // CANCEL BOOKING
  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setActionLoading(true);

      const response = await cancelBooking(booking._id);

      toast.info(response.message);

      setConfirmationModal(null);

      await fetchBooking();
    } catch (err) {
      (err);

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // CONFIRM SELECTED ACTION
  const handleConfirmAction = () => {
    if (confirmationModal === "checkin") {
      handleCheckIn();
    } else if (confirmationModal === "cancel") {
      handleCancelBooking();
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-loading">
          Loading booking...
        </div>
      </div>
    );
  }

  // BOOKING NOT FOUND
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

  const isCheckIn = confirmationModal === "checkin";

  return (
    <div className="booking-details-page">

      {/* HEADER */}

      <div className="booking-details-header">

        <button
          className="booking-details-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="booking-details-heading">
          <h2>Booking Details</h2>

          <p>
            View and manage booking information
          </p>
        </div>

      </div>

      {/* INFORMATION CARDS */}

      <div className="booking-details-grid">

        {/* APARTMENT */}

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

        {/* GUEST INFORMATION */}

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

        {/* BOOKING INFORMATION */}

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

        {/* PAYMENT INFORMATION */}

        <div className="booking-details-card">

          <div className="booking-details-card-header">
            <h3>Payment</h3>
          </div>

          <div className="booking-details-info-list">

            <p>
              <strong>Total Amount:</strong>

              <span className="booking-details-total">
                ₦
                {booking.totalPrice?.toLocaleString() || "0"}
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

      {/* ACTIONS */}

      <div className="booking-details-actions">

        {booking.bookingStatus === "CONFIRMED" && (
          <button
            className="booking-details-checkin-btn"
            onClick={() =>
              openConfirmationModal("checkin")
            }
            disabled={actionLoading}
          >
            Check In Guest
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
            onClick={() =>
              openConfirmationModal("cancel")
            }
          >
            Cancel Booking
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

      {/* CONFIRMATION MODAL */}

      {confirmationModal && (
        <div
          className="booking-confirm-overlay"
          onClick={closeConfirmationModal}
        >
          <div
            className="booking-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="booking-confirm-close"
              onClick={closeConfirmationModal}
              disabled={actionLoading}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div
              className={`booking-confirm-icon ${
                isCheckIn
                  ? "checkin-modal-icon"
                  : "cancel-modal-icon"
              }`}
            >
              {isCheckIn ? (
                <LogIn size={28} />
              ) : (
                <AlertTriangle size={28} />
              )}
            </div>

            <h3>
              {isCheckIn
                ? "Check In Guest?"
                : "Cancel Booking?"}
            </h3>

            <p>
              {isCheckIn
                ? `Are you sure you want to check in ${booking.customer?.fullName || "this guest"}?`
                : `Are you sure you want to cancel the booking for ${booking.customer?.fullName || "this guest"}? This action cannot be undone.`}
            </p>

            <div className="booking-confirm-actions">

              <button
                type="button"
                className="booking-confirm-cancel-btn"
                onClick={closeConfirmationModal}
                disabled={actionLoading}
              >
                Go Back
              </button>

              <button
                type="button"
                className={
                  isCheckIn
                    ? "booking-confirm-checkin-btn"
                    : "booking-confirm-delete-btn"
                }
                onClick={handleConfirmAction}
                disabled={actionLoading}
              >
                {actionLoading
                  ? isCheckIn
                    ? "Checking In..."
                    : "Cancelling..."
                  : isCheckIn
                    ? "Yes, Check In"
                    : "Yes, Cancel Booking"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingDetails;