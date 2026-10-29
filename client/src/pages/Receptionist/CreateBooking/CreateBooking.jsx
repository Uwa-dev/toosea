import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getAvailableApartments,
  createWalkInBooking,
} from "../../../services/bookingApi";

import "./createbooking.css";

const CreateBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rebookCustomer = location.state?.customer || null;

  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [customer, setCustomer] = useState({
    fullName: rebookCustomer?.fullName || "",
    email: rebookCustomer?.email || "",
    phone: rebookCustomer?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("CASH");

  /* =========================================
     FETCH AVAILABLE APARTMENTS
  ========================================= */

  useEffect(() => {
    fetchAvailableApartments();
  }, [checkIn, checkOut]);

  const fetchAvailableApartments = async () => {
    // No dates selected
    if (!checkIn || !checkOut) {
      setApartments([]);
      setSelectedApartment(null);
      return;
    }

    // Invalid date range
    if (new Date(checkOut) <= new Date(checkIn)) {
      setApartments([]);
      setSelectedApartment(null);
      return;
    }

    try {
      const data = await getAvailableApartments(
        checkIn,
        checkOut
      );

      setApartments(data.apartments || []);
      setSelectedApartment(null);
    } catch (err) {
      console.error(
        "Error fetching available apartments:",
        err
      );

      setApartments([]);
      setSelectedApartment(null);

      toast.error(
        err.response?.data?.message ||
          "Unable to find available apartments."
      );
    }
  };

  /* =========================================
     CALCULATE NIGHTS
  ========================================= */

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  /* =========================================
     CALCULATE TOTAL
  ========================================= */

  const total =
    selectedApartment && nights > 0
      ? nights * selectedApartment.pricePerNight
      : 0;

  /* =========================================
     SUBMIT BOOKING
  ========================================= */

  const handleSubmit = async () => {
    try {
      if (!checkIn || !checkOut) {
        return toast.error(
          "Select check-in and check-out dates."
        );
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        return toast.error(
          "Check-out must be after check-in."
        );
      }

      if (!selectedApartment) {
        return toast.error("Select an apartment.");
      }

      if (
        !customer.fullName.trim() ||
        !customer.phone.trim()
      ) {
        return toast.error(
          "Customer name and phone are required."
        );
      }

      const response = await createWalkInBooking({
        apartmentId: selectedApartment._id,

        customer: {
          fullName: customer.fullName.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
        },

        checkInDate: checkIn,
        checkOutDate: checkOut,

        paymentMethod,
      });

      toast.success(
        response.message ||
          "Booking created successfully."
      );

      // Reset form
      setSelectedApartment(null);
      setCheckIn("");
      setCheckOut("");
      setPaymentMethod("CASH");

      setCustomer({
        fullName: "",
        email: "",
        phone: "",
      });

      // If this was a rebooking, return to today's bookings
      if (rebookCustomer) {
        navigate("/receptionist/todaybookings");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    }
  };

  /* =========================================
     TODAY
  ========================================= */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="create-booking-page">

      <h2>
        {rebookCustomer
          ? "Rebook Guest"
          : "Create Walk-in Booking"}
      </h2>

      {/* =====================================
          REBOOK BANNER
      ===================================== */}

      {rebookCustomer && (
        <div className="rebook-banner">
          Rebooking guest. Customer details have
          been pre-filled.
        </div>
      )}

      {/* =====================================
          DATES
      ===================================== */}

      <div className="booking-date-fields">

        <div>
          <label>Check In</label>

          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              const value = e.target.value;

              setCheckIn(value);

              // Clear checkout if it is now invalid
              if (
                checkOut &&
                new Date(checkOut) <= new Date(value)
              ) {
                setCheckOut("");
              }
            }}
          />
        </div>

        <div>
          <label>Check Out</label>

          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) =>
              setCheckOut(e.target.value)
            }
          />
        </div>

      </div>

      {/* =====================================
          APARTMENT
      ===================================== */}

      <label>Apartment</label>

      <select
        value={selectedApartment?._id || ""}
        onChange={(e) => {
          const apartment = apartments.find(
            (item) =>
              item._id === e.target.value
          );

          setSelectedApartment(
            apartment || null
          );
        }}
        disabled={!checkIn || !checkOut}
      >
        <option value="">
          {!checkIn || !checkOut
            ? "Select dates first"
            : apartments.length === 0
            ? "No apartments available"
            : "Select Apartment"}
        </option>

        {apartments.map((item) => (
          <option
            key={item._id}
            value={item._id}
          >
            {item.name} - ₦
            {Number(
              item.pricePerNight
            ).toLocaleString()}
            /night
          </option>
        ))}
      </select>

      {/* =====================================
          CUSTOMER DETAILS
      ===================================== */}

      <label>Full Name</label>

      <input
        type="text"
        value={customer.fullName}
        onChange={(e) =>
          setCustomer((prev) => ({
            ...prev,
            fullName: e.target.value,
          }))
        }
        placeholder="Customer full name"
      />

      <label>Email</label>

      <input
        type="email"
        value={customer.email}
        onChange={(e) =>
          setCustomer((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        placeholder="Customer email"
      />

      <label>Phone</label>

      <input
        type="tel"
        value={customer.phone}
        onChange={(e) =>
          setCustomer((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        placeholder="Customer phone number"
      />

      {/* =====================================
          PAYMENT METHOD
      ===================================== */}

      <label>Payment Method</label>

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
      >
        <option value="CASH">Cash</option>
        <option value="TRANSFER">
          Bank Transfer
        </option>
        <option value="POS">POS</option>
      </select>

      {/* =====================================
          BOOKING SUMMARY
      ===================================== */}

      {selectedApartment && nights > 0 && (
        <div className="booking-summary">

          <h3>Booking Summary</h3>

          <p>
            Apartment:{" "}
            <strong>
              {selectedApartment.name}
            </strong>
          </p>

          <p>
            Check In:{" "}
            <strong>{checkIn}</strong>
          </p>

          <p>
            Check Out:{" "}
            <strong>{checkOut}</strong>
          </p>

          <p>
            Nights:{" "}
            <strong>{nights}</strong>
          </p>

          <p>
            Price/Night: ₦
            {Number(
              selectedApartment.pricePerNight
            ).toLocaleString()}
          </p>

          <hr />

          <h2>
            Total: ₦
            {total.toLocaleString()}
          </h2>

        </div>
      )}

      {/* =====================================
          CREATE BOOKING
      ===================================== */}

      <button
        onClick={handleSubmit}
        disabled={
          !checkIn ||
          !checkOut ||
          !selectedApartment
        }
      >
        Create Booking
      </button>

    </div>
  );
};

export default CreateBooking;