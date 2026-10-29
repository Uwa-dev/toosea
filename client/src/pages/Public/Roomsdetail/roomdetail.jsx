import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { singleApartment } from "../../../services/apartmentApi";
import { getApartmentBookedDates } from "../../../services/publicApi.js";
import { initializePayment } from "../../../services/paymentApi";
import { createOnlineBooking } from "../../../services/bookingApi";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { toast } from "react-toastify";
import "./roomdetail.css";

export default function RoomDetail() {
  const { id } = useParams();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  // ============================================================
  // BOOKING DATES
  // ============================================================

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ============================================================
  // CALENDAR
  // ============================================================

  const [selectedRange, setSelectedRange] = useState(undefined);
  const [bookedRanges, setBookedRanges] = useState([]);

  // ============================================================
  // CUSTOMER
  // ============================================================

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // ============================================================
  // DATE HELPERS
  // ============================================================

  const parseDateOnly = (value) => {
    if (!value) return null;

    const dateString =
      typeof value === "string"
        ? value.substring(0, 10)
        : "";

    const [year, month, day] =
      dateString.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  };

  const formatDateForInput = (date) => {
    if (!date) return "";

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] =
      dateString.split("-");

    return `${day}/${month}/${year}`;
  };

  // ============================================================
  // FETCH APARTMENT
  // ============================================================

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        setLoading(true);

        const apartmentResponse =
          await singleApartment(id);

        setApartment(
          apartmentResponse.apartment
        );

        const bookedDatesResponse =
          await getApartmentBookedDates(id);

        setBookedRanges(
          bookedDatesResponse.bookings || []
        );

      } catch (error) {
        console.error(
          "Error fetching apartment:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load apartment."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchApartmentData();
  }, [id]);

  // ============================================================
  // IMAGE SLIDER
  // ============================================================

  useEffect(() => {
    if (!apartment?.images?.length) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(
        (prev) =>
          (prev + 1) %
          apartment.images.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [apartment]);

  // ============================================================
  // CHECK BOOKED NIGHT
  // ============================================================

  const isDateBooked = (date) => {
    if (!date) return false;

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    return bookedRanges.some((booking) => {
      const bookedFrom =
        parseDateOnly(
          booking.checkInDate
        );

      const bookedTo =
        parseDateOnly(
          booking.checkOutDate
        );

      if (!bookedFrom || !bookedTo) {
        return false;
      }

      return (
        selectedDate >= bookedFrom &&
        selectedDate < bookedTo
      );
    });
  };

  // ============================================================
  // CHECK RANGE FOR CONFLICT
  // ============================================================

  const rangeHasBookedNight = (from, to) => {
    if (!from || !to) return false;

    return bookedRanges.some((booking) => {
      const bookedFrom =
        parseDateOnly(
          booking.checkInDate
        );

      const bookedTo =
        parseDateOnly(
          booking.checkOutDate
        );

      if (!bookedFrom || !bookedTo) {
        return false;
      }

      return (
        from < bookedTo &&
        to > bookedFrom
      );
    });
  };

  // ============================================================
  // CLEAR DATES
  // ============================================================

  const clearDates = () => {
    setSelectedRange(undefined);
    setCheckIn("");
    setCheckOut("");
  };

  // ============================================================
  // CALENDAR
  // ============================================================

  const handleDateSelect = (range) => {
    /*
     * User cleared the range.
     */

    if (!range) {
      clearDates();
      return;
    }

    /*
     * User selected only the first date.
     */

    if (range.from && !range.to) {
      if (isDateBooked(range.from)) {
        toast.error(
          "This date is already booked."
        );

        return;
      }

      setSelectedRange(range);

      setCheckIn(
        formatDateForInput(range.from)
      );

      setCheckOut("");

      return;
    }

    /*
     * User selected both dates.
     */

    if (range.from && range.to) {
      if (
        range.to.getTime() <=
        range.from.getTime()
      ) {
        clearDates();
        return;
      }

      if (
        rangeHasBookedNight(
          range.from,
          range.to
        )
      ) {
        toast.error(
          "Some of the selected nights are already booked."
        );

        clearDates();

        return;
      }

      setSelectedRange(range);

      setCheckIn(
        formatDateForInput(range.from)
      );

      setCheckOut(
        formatDateForInput(range.to)
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="room-detail loading-state">
        <h2>
          Loading apartment...
        </h2>
      </section>
    );
  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!apartment) {
    return (
      <section className="room-detail loading-state">
        <h2>
          Apartment not found.
        </h2>
      </section>
    );
  }

  // ============================================================
  // NIGHTS
  // ============================================================

  const nights =
    checkIn && checkOut
      ? Math.round(
          (
            parseDateOnly(checkOut) -
            parseDateOnly(checkIn)
          ) /
            (1000 *
              60 *
              60 *
              24)
        )
      : 0;

  // ============================================================
  // TOTAL
  // ============================================================

  const totalAmount =
    nights *
    (apartment.pricePerNight || 0);

  // ============================================================
  // PAYMENT
  // ============================================================

  const payNow = async () => {
    try {
      if (!checkIn || !checkOut) {
        return toast.warning(
          "Please select your check-in and check-out dates."
        );
      }

      if (nights <= 0) {
        return toast.warning(
          "Check-out must be after check-in."
        );
      }

      if (
        !customer.fullName.trim() ||
        !customer.email.trim() ||
        !customer.phone.trim()
      ) {
        return toast.warning(
          "Please fill in all your details."
        );
      }

      /*
       * Create booking.
       */

      const bookingResponse =
        await createOnlineBooking({
          apartmentId: apartment._id,

          customer: {
            fullName:
              customer.fullName.trim(),

            email:
              customer.email.trim(),

            phone:
              customer.phone.trim(),
          },

          checkInDate: checkIn,
          checkOutDate: checkOut,
        });

      if (!bookingResponse.success) {
        return toast.error(
          bookingResponse.message ||
            "Unable to create booking."
        );
      }

      /*
       * Initialize Paystack.
       */

      const paymentResponse =
        await initializePayment({
          bookingId:
            bookingResponse.booking._id,
        });

      if (!paymentResponse.success) {
        return toast.error(
          paymentResponse.message ||
            "Unable to initialize payment."
        );
      }

      /*
       * Redirect.
       */

      window.location.href =
        paymentResponse.authorization_url;

    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="room-detail">

      {/* HEADER */}

      <div className="room-header">

        <div>
          <h1>
            {apartment.name}
          </h1>

          <p className="location">
            📍{" "}
            {apartment.location ||
              "Lekki, Lagos"}
          </p>
        </div>

        <span
          className={`status-badge ${
            apartment.status ===
            "AVAILABLE"
              ? "available"
              : "booked"
          }`}
        >
          {apartment.status}
        </span>

      </div>

      {/* IMAGE GALLERY */}

      <div className="slider">

        <img
          className="main-image"
          src={
            apartment.images?.[
              currentIndex
            ]?.imageUrl ||
            "/toimages/room1.jpg"
          }
          alt={apartment.name}
        />

        <div className="thumbnails">

          {apartment.images?.map(
            (image, index) => (
              <img
                key={index}
                src={image.imageUrl}
                alt={`Apartment ${
                  index + 1
                }`}
                className={
                  currentIndex === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrentIndex(index)
                }
              />
            )
          )}

        </div>

      </div>

      {/* DETAILS */}

      <section className="details-section">

        <h2>
          Apartment Details
        </h2>

        <div className="details-grid">

          <div className="detail-card">
            <h4>
              Apartment Type
            </h4>

            <p>
              {apartment.apartmentType}
            </p>
          </div>

          <div className="detail-card">
            <h4>
              Capacity
            </h4>

            <p>
              {apartment.capacity} Guests
            </p>
          </div>

          <div className="detail-card">
            <h4>
              Price
            </h4>

            <p>
              ₦
              {(
                apartment.pricePerNight ||
                0
              ).toLocaleString()}

              <span className="price-unit">
                /night
              </span>
            </p>
          </div>

          <div className="detail-card">
            <h4>
              Status
            </h4>

            <p>
              {apartment.status}
            </p>
          </div>

        </div>

      </section>

      {/* DESCRIPTION */}

      <section className="description-section">

        <h2>
          About this Apartment
        </h2>

        <p>
          {apartment.description}
        </p>

      </section>

      {/* AMENITIES */}

      <section className="amenities-section">

        <h2>
          Amenities
        </h2>

        <div className="amenities-grid">

          {apartment.amenities?.map(
            (amenity, index) => (
              <div
                key={index}
                className="amenity-item"
              >
                <span>✓</span>

                {amenity}
              </div>
            )
          )}

        </div>

      </section>

      {/* HOUSE RULES */}

      <section className="rules-section">

        <h2>
          House Rules
        </h2>

        <ul className="rules-list">

          <li>
            ✔ Check-in: 2:00 PM
          </li>

          <li>
            ✔ Check-out: 11:00 AM
          </li>

          <li>
            ✔ No smoking indoors
          </li>

          <li>
            ✔ No parties or loud events
          </li>

          <li>
            ✔ Pets are not allowed
          </li>

          <li>
            ✔ Government-issued ID
            required at check-in
          </li>

          <li>
            ✔ Please respect neighbours
            and property.
          </li>

        </ul>

      </section>

      {/* BOOKING */}

      <section className="booking-section">

        <div className="booking-heading">

          <div>
            <span className="booking-eyebrow">
              RESERVATION
            </span>

            <h2>
              Book This Apartment
            </h2>
          </div>

          <div className="booking-price">

            <strong>
              ₦
              {(
                apartment.pricePerNight ||
                0
              ).toLocaleString()}
            </strong>

            <span>
              / night
            </span>

          </div>

        </div>

        <div className="booking-layout">

          {/* CALENDAR */}

          <div className="calendar-panel">

            <div className="calendar-header">

              <div>
                <h3>
                  Select your dates
                </h3>

                <p>
                  Select your check-in
                  and check-out dates.
                </p>
              </div>

              {(checkIn || checkOut) && (
                <button
                  type="button"
                  className="clear-dates-btn"
                  onClick={clearDates}
                >
                  Clear dates
                </button>
              )}

            </div>

            <div className="calendar-wrapper">

            <div className="calendar-wrapper">

              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={(range) => {
                  if (!range) {
                    setSelectedRange(undefined);
                    setCheckIn("");
                    setCheckOut("");
                    return;
                  }

                  // First click = check-in
                  if (range.from && !range.to) {
                    if (isDateBooked(range.from)) {
                      toast.error(
                        "This date is already booked."
                      );
                      return;
                    }

                    setSelectedRange({
                      from: range.from,
                      to: undefined,
                    });

                    setCheckIn(
                      formatDateForInput(range.from)
                    );

                    setCheckOut("");

                    return;
                  }

                  // Second click = check-out
                  if (range.from && range.to) {
                    if (
                      rangeHasBookedNight(
                        range.from,
                        range.to
                      )
                    ) {
                      toast.error(
                        "Some of the selected nights are already booked."
                      );

                      setSelectedRange(undefined);
                      setCheckIn("");
                      setCheckOut("");

                      return;
                    }

                    setSelectedRange({
                      from: range.from,
                      to: range.to,
                    });

                    setCheckIn(
                      formatDateForInput(range.from)
                    );

                    setCheckOut(
                      formatDateForInput(range.to)
                    );
                  }
                }}

                disabled={{
                  before: new Date(),
                }}

                modifiers={{
                  booked: (date) =>
                    isDateBooked(date),
                }}

                modifiersClassNames={{
                  booked: "booked-date",
                }}

                numberOfMonths={1}
                pagedNavigation
              />

            </div>

            </div>

            <div className="calendar-help">

              <div>
                <span className="legend available-dot"></span>
                Available
              </div>

              <div>
                <span className="legend booked-dot"></span>
                Booked
              </div>

              <div>
                <span className="legend selected-dot"></span>
                Selected
              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="booking-form-panel">

            <h3>
              Your reservation
            </h3>

            <div className="date-summary">

              <div className="date-box">

                <span>
                  CHECK-IN
                </span>

                <strong>
                  {checkIn
                    ? formatDisplayDate(
                        checkIn
                      )
                    : "-- / -- / ----"}
                </strong>

              </div>

              <div className="date-arrow">
                →
              </div>

              <div className="date-box">

                <span>
                  CHECK-OUT
                </span>

                <strong>
                  {checkOut
                    ? formatDisplayDate(
                        checkOut
                      )
                    : "-- / -- / ----"}
                </strong>

              </div>

            </div>

            {nights > 0 && (
              <div className="night-count">
                {nights}{" "}
                {nights === 1
                  ? "night"
                  : "nights"}
              </div>
            )}

            <div className="customer-fields">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={
                    customer.fullName
                  }
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      fullName:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  value={
                    customer.email
                  }
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="08012345678"
                  value={
                    customer.phone
                  }
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {nights > 0 && (
              <div className="booking-summary">

                <div className="summary-row">

                  <span>
                    ₦
                    {(
                      apartment.pricePerNight ||
                      0
                    ).toLocaleString()}{" "}
                    × {nights}{" "}
                    {nights === 1
                      ? "night"
                      : "nights"}
                  </span>

                  <strong>
                    ₦
                    {totalAmount.toLocaleString()}
                  </strong>

                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₦
                    {totalAmount.toLocaleString()}
                  </strong>

                </div>

              </div>
            )}

            <button
              className="btn pay-btn"
              disabled={nights <= 0}
              onClick={payNow}
            >
              {nights > 0
                ? `Pay ₦${totalAmount.toLocaleString()} & Book`
                : "Select Dates"}
            </button>

            <p className="payment-note">
              You will be redirected to
              Paystack to complete your
              payment securely.
            </p>

          </div>

        </div>

      </section>

    </section>
  );
}