import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllApartments } from "../../../services/apartmentApi";
import { createWalkInBooking } from "../../../services/bookingApi";

const CreateBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rebookCustomer = location.state?.customer || null;

  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] =
    useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [customer, setCustomer] = useState({
    fullName: rebookCustomer?.fullName || "",
    email: rebookCustomer?.email || "",
    phone: rebookCustomer?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("CASH");

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const data = await getAllApartments();

      const available = data.apartments.filter(
        (item) =>
          item.isActive &&
          item.status === "AVAILABLE"
      );

      setApartments(available);
    } catch (err) {
      console.log(err);
    }
  };

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) -
            new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const total =
    selectedApartment && nights > 0
      ? nights *
        selectedApartment.pricePerNight
      : 0;

  const handleSubmit = async () => {
    try {
      if (!selectedApartment) {
        return alert("Select an apartment.");
      }

      if (!checkIn || !checkOut) {
        return alert(
          "Select check-in and check-out dates."
        );
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        return alert(
          "Check-out must be after check-in."
        );
      }

      if (
        !customer.fullName.trim() ||
        !customer.phone.trim()
      ) {
        return alert(
          "Customer name and phone are required."
        );
      }

      const response =
        await createWalkInBooking({
          apartmentId: selectedApartment._id,
          customer,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          paymentMethod,
        });

      alert(
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

      // If we came from the Rebook button,
      // return to Checked In page.
      if (rebookCustomer) {
        navigate("/receptionist/todaybookings");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    }
  };

  return (
    <div className="create-booking-page">
      <h2>
        {rebookCustomer
          ? "Rebook Guest"
          : "Create Walk-in Booking"}
      </h2>

      {rebookCustomer && (
        <div className="rebook-banner">
          Rebooking guest. Customer details have
          been pre-filled.
        </div>
      )}

      <label>Apartment</label>

      <select
        value={selectedApartment?._id || ""}
        onChange={(e) => {
          const apartment = apartments.find(
            (item) =>
              item._id === e.target.value
          );

          setSelectedApartment(apartment);
        }}
      >
        <option value="">
          Select Apartment
        </option>

        {apartments.map((item) => (
          <option
            key={item._id}
            value={item._id}
          >
            {item.name} - ₦
            {item.pricePerNight.toLocaleString()}
            /night
          </option>
        ))}
      </select>

      <label>Check In</label>

      <input
        type="date"
        value={checkIn}
        min={
          new Date()
            .toISOString()
            .split("T")[0]
        }
        onChange={(e) =>
          setCheckIn(e.target.value)
        }
      />

      <label>Check Out</label>

      <input
        type="date"
        value={checkOut}
        min={
          checkIn ||
          new Date()
            .toISOString()
            .split("T")[0]
        }
        onChange={(e) =>
          setCheckOut(e.target.value)
        }
      />

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
      />

      <label>Payment Method</label>

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
      >
        <option value="CASH">
          Cash
        </option>
        <option value="TRANSFER">
          Bank Transfer
        </option>
        <option value="POS">
          POS
        </option>
      </select>

      {selectedApartment &&
        nights > 0 && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>

            <p>Nights: {nights}</p>

            <p>
              Price/Night: ₦
              {selectedApartment.pricePerNight.toLocaleString()}
            </p>

            <hr />

            <h2>
              Total: ₦
              {total.toLocaleString()}
            </h2>
          </div>
        )}

      <button onClick={handleSubmit}>
        Create Booking
      </button>
    </div>
  );
};

export default CreateBooking;