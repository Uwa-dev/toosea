
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  getPendingBookings,
  cancelPendingBooking,
} from "../../../services/bookingApi";
import "./pendingBooking.css";

// ===============================
// FORMAT HELPERS
// ===============================

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
};

// ===============================
// BOOKING DATA HELPERS
// ===============================

const getBookingReference = (booking) =>
  booking.bookingReference ||
  booking.reference ||
  booking._id ||
  "—";

const getGuestName = (booking) =>
  booking.customer?.fullName || "Guest";

const getGuestEmail = (booking) =>
  booking.customer?.email || "—";

const getGuestPhone = (booking) =>
  booking.customer?.phone || "—";
const getApartmentName = (booking) =>
  booking.apartment?.name ||
  booking.apartment?.apartmentName ||
  booking.apartmentName ||
  booking.apartment?.apartmentCode ||
  booking.apartmentCode ||
  "Apartment";

const getBookingAmount = (booking) =>
  booking.totalAmount ??
  booking.totalPrice ??
  booking.total ??
  booking.amount ??
  booking.price ??
  null;

const getPaymentStatus = (booking) =>
  booking.paymentStatus ||
  booking.payment?.status ||
  "—";

const getBookingStatus = (booking) =>
  booking.bookingStatus ||
  booking.status ||
  "PENDING";

const getCheckIn = (booking) =>
  booking.checkIn ||
  booking.checkInDate ||
  booking.startDate;

const getCheckOut = (booking) =>
  booking.checkOut ||
  booking.checkOutDate ||
  booking.endDate;

// ===============================
// MAIN COMPONENT
// ===============================

const PendingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  // ===============================
  // FETCH PENDING BOOKINGS
  // ===============================

  const fetchPendingBookings = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getPendingBookings();

        const list = Array.isArray(response)
          ? response
          : response?.bookings ??
            response?.data?.bookings ??
            [];

        if (!Array.isArray(list)) {
          throw new Error(
            "Unexpected response format from pending bookings API."
          );
        }

        setBookings(list);
      } catch (error) {
        console.error("Fetch pending bookings error:", error);

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Unable to load pending bookings."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPendingBookings();
  }, [fetchPendingBookings]);

  // ===============================
  // SEARCH BOOKINGS
  // ===============================

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return bookings;

    return bookings.filter((booking) => {
      const searchableValues = [
        getBookingReference(booking),
        getGuestName(booking),
        getGuestEmail(booking),
        getGuestPhone(booking),
        getApartmentName(booking),
        booking.apartment?.apartmentCode,
        getPaymentStatus(booking),
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [bookings, searchTerm]);

  // ===============================
  // OPEN CANCELLATION MODAL
  // ===============================

  const handleCancelBooking = (booking) => {
    if (getBookingStatus(booking) !== "PENDING") {
      toast.error(
        "Only pending bookings can be cancelled here."
      );
      return;
    }

    setBookingToCancel(booking);
  };

  // ===============================
  // CONFIRM BOOKING CANCELLATION
  // ===============================

  const confirmCancelBooking = async () => {
    if (!bookingToCancel || cancellingId) return;

    const booking = bookingToCancel;

    try {
      setCancellingId(booking._id);

      const response = await cancelPendingBooking(booking._id);

      // Remove cancelled booking from the table
      setBookings((previous) =>
        previous.filter(
          (item) => item._id !== booking._id
        )
      );

      // Close booking details if this is the selected booking
      setSelectedBooking((previous) =>
        previous?._id === booking._id ? null : previous
      );

      // Close confirmation modal
      setBookingToCancel(null);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Booking cancelled successfully."
      );
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel this booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // ===============================
  // CLOSE CANCELLATION MODAL
  // ===============================

  const closeCancelModal = () => {
    if (cancellingId) return;

    setBookingToCancel(null);
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <section className="pending-bookings-page">

      {/* PAGE HEADER */}

      <header className="pending-bookings-header">
        <div>
          <span className="pending-bookings-eyebrow">
            BOOKING MANAGEMENT
          </span>

          <h1>Pending Bookings</h1>

          <p>
            Review guest reservations and manage bookings awaiting
            confirmation.
          </p>
        </div>

        <button
          type="button"
          className="pending-refresh-btn"
          onClick={() => fetchPendingBookings(true)}
          disabled={loading || refreshing}
        >
          <span className={refreshing ? "pending-spin" : ""}>
            ↻
          </span>

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* SUMMARY CARD */}

      <div className="pending-bookings-summary">
        <div
          className="pending-summary-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <rect
              x="3.5"
              y="5"
              width="17"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M7.5 3.5V7M16.5 3.5V7M3.5 9.5H20.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M12 12.5V15.5M12 15.5L14 14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <span className="pending-summary-label">
            Awaiting attention
          </span>

          <strong className="pending-summary-count">
            {loading ? "—" : bookings.length}
          </strong>

          <span className="pending-summary-caption">
            Pending {bookings.length === 1 ? "booking" : "bookings"}
          </span>
        </div>
      </div>

      {/* BOOKINGS TABLE CARD */}

      <div className="pending-bookings-card">

        {/* TOOLBAR */}

        <div className="pending-bookings-toolbar">
          <div>
            <h2>Reservation requests</h2>

            <p>
              View booking information or cancel a pending reservation.
            </p>
          </div>

          <label className="pending-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.8"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search pending bookings"
            />
          </label>
        </div>

        {/* LOADING STATE */}

        {loading ? (
          <div className="pending-bookings-state">
            <span className="pending-loader" />
            <p>Loading pending bookings...</p>
          </div>

        ) : filteredBookings.length === 0 ? (

          /* EMPTY STATE */

          <div className="pending-bookings-state">
            <div className="pending-empty-icon">
              {searchTerm ? "⌕" : "✓"}
            </div>

            <h3>
              {searchTerm
                ? "No matching bookings"
                : "No pending bookings"}
            </h3>

            <p>
              {searchTerm
                ? "Try another booking reference, guest name, email, or apartment."
                : "New reservations awaiting attention will appear here."}
            </p>

            {searchTerm && (
              <button
                type="button"
                className="pending-clear-search"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            )}
          </div>

        ) : (

          /* BOOKINGS TABLE */

          <>
            <div className="pending-table-wrapper">
              <table className="pending-bookings-table">

                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Apartment</th>
                    <th>Stay dates</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>

                      {/* BOOKING */}

                      <td>
                        <span className="pending-reference">
                          {getBookingReference(booking)}
                        </span>

                        <span className="pending-cell-subtext">
                          {formatDate(booking.createdAt)}
                        </span>
                      </td>

                      {/* GUEST */}

                      <td>
                        <span className="pending-guest-name">
                          {getGuestName(booking)}
                        </span>

                        <span className="pending-cell-subtext">
                          {getGuestEmail(booking)}
                        </span>
                      </td>

                      {/* APARTMENT */}

                      <td>
                        <span className="pending-apartment-name">
                          {getApartmentName(booking)}
                        </span>

                        {booking.apartment?.apartmentCode &&
                          getApartmentName(booking) !==
                            booking.apartment.apartmentCode && (
                            <span className="pending-cell-subtext">
                              {booking.apartment.apartmentCode}
                            </span>
                          )}
                      </td>

                      {/* STAY DATES */}

                      <td>
                        <span className="pending-date">
                          {formatDate(getCheckIn(booking))}
                        </span>

                        <span className="pending-cell-subtext">
                          to {formatDate(getCheckOut(booking))}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td className="pending-amount">
                        {formatMoney(getBookingAmount(booking))}
                      </td>

                      {/* PAYMENT STATUS */}

                      <td>
                        <span
                          className={`pending-payment-badge pending-payment-${String(
                            getPaymentStatus(booking)
                          ).toLowerCase()}`}
                        >
                          {String(
                            getPaymentStatus(booking)
                          ).replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="pending-row-actions">

                          <button
                            type="button"
                            className="pending-view-btn"
                            onClick={() =>
                              setSelectedBooking(booking)
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="pending-cancel-btn"
                            disabled={
                              cancellingId === booking._id ||
                              getBookingStatus(booking) !== "PENDING"
                            }
                            onClick={() =>
                              handleCancelBooking(booking)
                            }
                          >
                            Cancel
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* TABLE FOOTER */}

            <div className="pending-table-footer">
              Showing <strong>{filteredBookings.length}</strong> of{" "}
              <strong>{bookings.length}</strong> pending bookings
            </div>
          </>
        )}
      </div>

      {/* =====================================
          BOOKING DETAILS MODAL
      ===================================== */}

      {selectedBooking && (
        <div
          className="pending-modal-overlay"
          onClick={() => setSelectedBooking(null)}
          role="presentation"
        >
          <section
            className="pending-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pending-modal-title"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <header className="pending-modal-header">
              <div>
                <span className="pending-bookings-eyebrow">
                  RESERVATION DETAILS
                </span>

                <h2 id="pending-modal-title">
                  Booking information
                </h2>

                <p>
                  {getBookingReference(selectedBooking)}
                </p>
              </div>

              <button
                type="button"
                className="pending-modal-close"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close booking details"
              >
                ×
              </button>
            </header>

            {/* MODAL CONTENT */}

            <div className="pending-modal-content">

              {/* BOOKING STATUS */}

              <div className="pending-modal-status-row">
                <span className="pending-detail-label">
                  Booking status
                </span>

                <span className="pending-status-badge">
                  {String(
                    getBookingStatus(selectedBooking)
                  ).replace(/_/g, " ")}
                </span>
              </div>

              {/* GUEST INFORMATION */}

              <div className="pending-detail-section">
                <h3>Guest information</h3>

                <div className="pending-detail-grid">

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Full name
                    </span>

                    <strong>
                      {getGuestName(selectedBooking)}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Email address
                    </span>

                    <strong>
                      {getGuestEmail(selectedBooking)}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Phone number
                    </span>

                    <strong>
                      {getGuestPhone(selectedBooking)}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Booking reference
                    </span>

                    <strong>
                      {getBookingReference(selectedBooking)}
                    </strong>
                  </div>

                </div>
              </div>

              {/* STAY INFORMATION */}

              <div className="pending-detail-section">
                <h3>Stay information</h3>

                <div className="pending-detail-grid">

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Apartment
                    </span>

                    <strong>
                      {getApartmentName(selectedBooking)}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Apartment code
                    </span>

                    <strong>
                      {selectedBooking.apartment?.apartmentCode ||
                        selectedBooking.apartmentCode ||
                        "—"}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Check-in
                    </span>

                    <strong>
                      {formatDate(getCheckIn(selectedBooking))}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Check-out
                    </span>

                    <strong>
                      {formatDate(getCheckOut(selectedBooking))}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Guests
                    </span>

                    <strong>
                      {selectedBooking.numberOfGuests ??
                        selectedBooking.guests ??
                        selectedBooking.guestCount ??
                        "—"}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Booked on
                    </span>

                    <strong>
                      {formatDate(selectedBooking.createdAt)}
                    </strong>
                  </div>

                </div>
              </div>

              {/* PAYMENT INFORMATION */}

              <div className="pending-detail-section">
                <h3>Payment information</h3>

                <div className="pending-detail-grid">

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Total amount
                    </span>

                    <strong className="pending-modal-amount">
                      {formatMoney(
                        getBookingAmount(selectedBooking)
                      )}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Payment status
                    </span>

                    <strong>
                      {getPaymentStatus(selectedBooking)}
                    </strong>
                  </div>

                  <div className="pending-detail-item">
                    <span className="pending-detail-label">
                      Payment method
                    </span>

                    <strong>
                      {selectedBooking.paymentMethod ||
                        selectedBooking.paymentMode ||
                        selectedBooking.payment?.method ||
                        "—"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* SPECIAL REQUESTS */}

              {selectedBooking.specialRequests && (
                <div className="pending-detail-section">
                  <h3>Special requests</h3>

                  <p className="pending-special-requests">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}

            <footer className="pending-modal-footer">

              <button
                type="button"
                className="pending-modal-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>

              {getBookingStatus(selectedBooking) === "PENDING" && (
                <button
                  type="button"
                  className="pending-modal-cancel"
                  disabled={Boolean(cancellingId)}
                  onClick={() =>
                    handleCancelBooking(selectedBooking)
                  }
                >
                  Cancel booking
                </button>
              )}

            </footer>

          </section>
        </div>
      )}

      {/* =====================================
          CANCELLATION CONFIRMATION MODAL
          This is separate from the details modal.
      ===================================== */}

      {bookingToCancel && (
        <div
          className="pending-modal-overlay pending-cancel-overlay"
          onClick={closeCancelModal}
          role="presentation"
        >
          <section
            className="pending-cancel-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="pending-cancel-icon">
              !
            </div>

            <h2 id="cancel-booking-title">
              Cancel this booking?
            </h2>

            <p>
              Are you sure you want to cancel booking{" "}
              <strong>
                {getBookingReference(bookingToCancel)}
              </strong>
              ?
            </p>

            <p className="pending-cancel-warning">
              This action cannot be undone.
            </p>

            <div className="pending-cancel-actions">

              <button
                type="button"
                className="pending-modal-secondary"
                disabled={Boolean(cancellingId)}
                onClick={closeCancelModal}
              >
                Keep Booking
              </button>

              <button
                type="button"
                className="pending-modal-cancel"
                disabled={Boolean(cancellingId)}
                onClick={confirmCancelBooking}
              >
                {cancellingId
                  ? "Cancelling..."
                  : "Yes, Cancel Booking"}
              </button>

            </div>

          </section>
        </div>
      )}

    </section>
  );
};

export default PendingBookings;
