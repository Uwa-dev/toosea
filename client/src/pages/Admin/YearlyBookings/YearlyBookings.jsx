import { useEffect, useState } from "react";
import {
  getYearlyBookings,
} from "../../../services/bookingApi";
import "./yearlybooking.css";

const YearBookings = () => {
  const currentYear =
    new Date().getFullYear();

  const [year, setYear] =
    useState(currentYear);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchBookings();
  }, [year]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data =
        await getYearlyBookings(year);

      setBookings(data.bookings);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load yearly bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "PAID"
      )
      .reduce(
        (total, booking) =>
          total +
          (booking.totalPrice || 0),
        0
      );

  return (
    <div className="yearly-bookings">

      <h2>
        Bookings for {year}
      </h2>

      {/* YEAR FILTER */}

      <div className="booking-filters">

        <select
          value={year}
          onChange={(e) =>
            setYear(
              Number(e.target.value)
            )
          }
        >
          {Array.from(
            {
              length: 5,
            },
            (_, index) =>
              currentYear -
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

        <div>
          <h3>
            Total Bookings
          </h3>

          <p>
            {bookings.length}
          </p>
        </div>

        <div>
          <h3>
            Total Revenue
          </h3>

          <p>
            ₦
            {totalRevenue.toLocaleString()}
          </p>
        </div>

      </div>

      {loading ? (
        <h3>
          Loading bookings...
        </h3>
      ) : bookings.length === 0 ? (
        <p>
          No bookings found for{" "}
          {year}.
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

export default YearBookings;