import { useEffect, useState } from "react";
import {
  getMonthlyBookings,
} from "../../../services/bookingApi";
import "./monthbooking.css";

const MonthBookings = () => {
  const today = new Date();

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchBookings();
  }, [year, month]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data =
        await getMonthlyBookings(
          year,
          month
        );

      setBookings(data.bookings);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load monthly bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const monthName = new Date(
    year,
    month - 1
  ).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="monthly-bookings">

      <h2>
        Bookings for {monthName} {year}
      </h2>

      {/* FILTERS */}

      <div className="booking-filters">

        <select
          value={month}
          onChange={(e) =>
            setMonth(Number(e.target.value))
          }
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>

        <select
          value={year}
          onChange={(e) =>
            setYear(Number(e.target.value))
          }
        >
          {Array.from(
            {
              length: 5,
            },
            (_, index) =>
              today.getFullYear() -
              index
          ).map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

      </div>

      {/* SUMMARY */}

      <div className="booking-summary">

        <h3>
          Total Bookings: {bookings.length}
        </h3>

      </div>

      {/* TABLE */}

      {loading ? (
        <h3>Loading bookings...</h3>
      ) : bookings.length === 0 ? (
        <p>
          No bookings found for{" "}
          {monthName} {year}.
        </p>
      ) : (
        <table className="booking-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Guest</th>
              <th>Apartment</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Created By</th>
            </tr>
          </thead>

          <tbody>

            {bookings.map(
              (booking, index) => (
                <tr
                  key={booking._id}
                >

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {booking.customer
                      ?.fullName}
                  </td>

                  <td>
                    {booking.apartment
                      ?.name}
                  </td>

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
                    ₦
                    {booking.totalPrice?.toLocaleString()}
                  </td>

                  <td>
                    {booking.bookingSource}
                  </td>

                  <td>
                    {booking.paymentMethod}
                  </td>

                  <td>
                    {booking.bookingStatus}
                  </td>

                  <td>
                    {booking.createdBy
                      ?.fullName ||
                      "Online"}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>
      )}

    </div>
  );
};

export default MonthBookings;