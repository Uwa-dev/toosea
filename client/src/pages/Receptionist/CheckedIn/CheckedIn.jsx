import { useEffect, useState } from "react";
import {
  getCheckedInGuests,
  checkOutGuest,
} from "../../../services/bookingApi";
import { LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./checkedin.css";

const CheckedIn = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert(
        err.response?.data?.message ||
          "Unable to load guests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    const confirmCheckout = window.confirm(
      "Check out this guest?"
    );

    if (!confirmCheckout) return;

    try {
      const response = await checkOutGuest(id);

      alert(response.message);

      fetchGuests();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to check out guest."
      );
    }
  };

  const handleRebook = async (booking) => {
    const confirmRebook = window.confirm(
      "This will check out the guest and open a new booking form. Continue?"
    );

    if (!confirmRebook) return;

    try {
      await checkOutGuest(booking._id);

      navigate("/receptionist/walkin", {
        state: {
          customer: booking.customer,
          previousBookingId: booking._id,
        },
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to rebook guest."
      );
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
                  navigate(
                    `/receptionist/bookings/${booking._id}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>

                <td>{booking.apartment?.name}</td>

                <td>{booking.customer?.fullName}</td>

                <td>{booking.customer?.phone}</td>

                <td>
                  {new Date(
                    booking.checkInDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {new Date(
                    booking.checkOutDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  <span
                    className={
                      booking.bookingStatus ===
                      "EXPIRED"
                        ? "expired"
                        : "checkedin"
                    }
                  >
                    {booking.bookingStatus}
                  </span>
                </td>

                <td
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <div className="table-actions">
                    <button
                      className="action-btn checkout-btn"
                      title="Check Out Guest"
                      onClick={() =>
                        handleCheckOut(
                          booking._id
                        )
                      }
                    >
                      <LogOut size={18} />
                    </button>

                    <button
                      className="action-btn rebook-btn"
                      title="Create New Booking"
                      onClick={() =>
                        handleRebook(booking)
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
    </div>
  );
};

export default CheckedIn;