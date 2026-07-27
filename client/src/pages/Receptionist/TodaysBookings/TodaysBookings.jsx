import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayBookings } from "../../../services/bookingApi";
import "./todays.css";

const TodaysBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await getTodayBookings();

      setBookings(data);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="today-bookings">
      <div className="page-header">
        <h2>Today's Bookings</h2>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings for today.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Apartment</th>
              <th>Guest</th>
              <th>Phone</th>
              <th>Check Out</th>
              <th>Nights</th>
              <th>Amount</th>
              <th>Booking Type</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => {
              const nights = Math.ceil(
                (new Date(booking.checkOutDate) -
                  new Date(booking.checkInDate)) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <tr key={booking._id} onClick={() =>
                    navigate(
                    `/receptionist/bookings/${booking._id}`
                    )
                }>
                  <td>{index + 1}</td>

                  <td>
                    {booking.apartment?.name}
                  </td>

                  <td>
                    {booking.customer?.fullName}
                  </td>

                  <td>
                    {booking.customer?.phone}
                  </td>

                  <td>
                    {new Date(
                      booking.checkOutDate
                    ).toLocaleDateString()}
                  </td>

                  <td>{nights}</td>

                  <td>
                    ₦
                    {booking.totalPrice.toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={
                        booking.bookingSource ===
                        "ONLINE"
                          ? "online-badge"
                          : "walkin-badge"
                      }
                    >
                      {booking.bookingSource}
                    </span>
                  </td>

                  <td>
                    {booking.paymentMethod}
                  </td>

                  <td>
                    <span
                      className={`status ${booking.bookingStatus.toLowerCase()}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodaysBookings;