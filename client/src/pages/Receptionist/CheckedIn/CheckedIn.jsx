import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCheckedInGuests,
  checkOutGuest,
} from "../../../services/bookingApi";
import {
  RefreshCw,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./checkedin.css";

const CheckedIn = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirmation modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);

      const data = await getCheckedInGuests();
      setBookings(data.bookings);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to load guests."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal
  const openConfirmation = (booking, action) => {
    setSelectedBooking(booking);
    setConfirmationAction(action);
  };

  // Close confirmation modal
  const closeConfirmation = () => {
    if (actionLoading) return;

    setSelectedBooking(null);
    setConfirmationAction(null);
  };

  // Check out guest
  const handleCheckOut = async () => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);

      const response = await checkOutGuest(selectedBooking._id);

      toast.info(response.message || "Guest checked out successfully.");

      setSelectedBooking(null);
      setConfirmationAction(null);

      await fetchGuests();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to check out guest."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Check out guest and open a new booking form
  const handleRebook = async () => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);

      await checkOutGuest(selectedBooking._id);

      const booking = selectedBooking;

      setSelectedBooking(null);
      setConfirmationAction(null);

      navigate("/receptionist/walkin", {
        state: {
          customer: booking.customer,
          previousBookingId: booking._id,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to rebook guest."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmationAction === "checkout") {
      handleCheckOut();
    } else if (confirmationAction === "rebook") {
      handleRebook();
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="checkedin-page">
      <h2>Currently Occupied Apartments</h2>

      {bookings.length === 0 ? (
        <div className="empty-state">
          No guests are currently staying.
        </div>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Apartment</th>
              <th>Guest</th>
              <th>Phone</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking._id}
                onClick={() =>
                  navigate(`/receptionist/bookings/${booking._id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>

                <td>{booking.apartment?.name}</td>

                <td>{booking.customer?.fullName}</td>

                <td>{booking.customer?.phone}</td>

                <td>
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </td>

                <td>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>

                <td>
                  <span
                    className={
                      booking.bookingStatus === "EXPIRED"
                        ? "expired"
                        : "checkedin"
                    }
                  >
                    {booking.bookingStatus}
                  </span>
                </td>

                <td onClick={(e) => e.stopPropagation()}>
                  <div className="table-actions">
                    <button
                      className="action-btn checkout-btn"
                      title="Check Out Guest"
                      onClick={() =>
                        openConfirmation(booking, "checkout")
                      }
                    >
                      <LogOut size={18} />
                    </button>

                    <button
                      className="action-btn rebook-btn"
                      title="Create New Booking"
                      onClick={() =>
                        openConfirmation(booking, "rebook")
                      }
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {selectedBooking && confirmationAction && (
        <div
          className="checkedin-modal-overlay"
          onClick={closeConfirmation}
        >
          <div
            className="checkedin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="checkedin-modal-close"
              onClick={closeConfirmation}
              disabled={actionLoading}
            >
              <X size={20} />
            </button>

            <div
              className={`checkedin-modal-icon ${
                confirmationAction === "rebook"
                  ? "rebook-modal-icon"
                  : "checkout-modal-icon"
              }`}
            >
              {confirmationAction === "rebook" ? (
                <RefreshCw size={28} />
              ) : (
                <AlertTriangle size={28} />
              )}
            </div>

            <h3>
              {confirmationAction === "rebook"
                ? "Rebook Guest?"
                : "Check Out Guest?"}
            </h3>

            <p>
              {confirmationAction === "rebook" ? (
                <>
                  This will check out{" "}
                  <strong>
                    {selectedBooking.customer?.fullName}
                  </strong>{" "}
                  and open a new booking form. Do you want to continue?
                </>
              ) : (
                <>
                  Are you sure you want to check out{" "}
                  <strong>
                    {selectedBooking.customer?.fullName}
                  </strong>
                  ?
                </>
              )}
            </p>

            <div className="checkedin-modal-actions">
              <button
                className="checkedin-cancel-btn"
                onClick={closeConfirmation}
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                className={
                  confirmationAction === "rebook"
                    ? "checkedin-rebook-btn"
                    : "checkedin-confirm-btn"
                }
                onClick={handleConfirmAction}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : confirmationAction === "rebook"
                  ? "Continue"
                  : "Check Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckedIn;