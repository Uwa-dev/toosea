import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { singleApartment } from "../../../services/apartmentApi";
import { initializePayment } from "../../../services/paymentApi";
import { createOnlineBooking } from "../../../services/bookingApi";
import "./roomdetail.css";

export default function RoomDetail() {
  const { id } = useParams();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await singleApartment(id);
        setApartment(response.apartment);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  // Auto image slider
  useEffect(() => {
    if (!apartment?.images?.length) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % apartment.images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [apartment]);

  if (loading) {
    return (
      <section className="room-detail">
        <h2>Loading apartment...</h2>
      </section>
    );
  }

  if (!apartment) {
    return (
      <section className="room-detail">
        <h2>Apartment not found.</h2>
      </section>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalAmount =
    nights * (apartment?.pricePerNight || 0);

  const payNow = async () => {
    try {
      // Validate dates
      if (!checkIn || !checkOut) {
        return alert(
          "Please select your check-in and check-out dates."
        );
      }

      // Validate customer
      if (
        !customer.fullName ||
        !customer.email ||
        !customer.phone
      ) {
        return alert("Please fill in all your details.");
      }

      // Validate number of nights
      if (nights <= 0) {
        return alert(
          "Check-out date must be after check-in date."
        );
      }

      // STEP 1 - Create booking
      const bookingResponse =
        await createOnlineBooking({
          apartmentId: apartment._id,
          customer,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        });

      if (!bookingResponse.success) {
        return alert(
          bookingResponse.message ||
            "Unable to create booking."
        );
      }

      // STEP 2 - Initialize Paystack
      const paymentResponse =
        await initializePayment({
          bookingId: bookingResponse.booking._id,
        });

      if (!paymentResponse.success) {
        return alert(
          paymentResponse.message ||
            "Unable to initialize payment."
        );
      }

      // STEP 3 - Redirect customer to Paystack
      window.location.href =
        paymentResponse.authorization_url;

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <section className="room-detail">

      {/* Header */}
      <div className="room-header">
        <div>
          <h1>{apartment.name}</h1>
          <p className="location">
            📍 {apartment.location || "Lekki, Lagos"}
          </p>
        </div>

        <span
          className={`status-badge ${
            apartment.status === "AVAILABLE"
              ? "available"
              : "booked"
          }`}
        >
          {apartment.status}
        </span>
      </div>

      {/* Image Gallery */}
      <div className="slider">
        <img
          className="main-image"
          src={
            apartment.images[currentIndex]?.imageUrl ||
            "/toimages/room1.jpg"
          }
          alt={apartment.name}
        />

        <div className="thumbnails">
          {apartment.images.map((image, index) => (
            <img
              key={index}
              src={image.imageUrl}
              alt={`Apartment ${index + 1}`}
              className={
                currentIndex === index
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentIndex(index)
              }
            />
          ))}
        </div>
      </div>

      {/* Apartment Details */}
      <section className="details-section">
        <h2>Apartment Details</h2>

        <div className="details-grid">

          <div className="detail-card">
            <h4>Apartment Type</h4>
            <p>{apartment.apartmentType}</p>
          </div>

          <div className="detail-card">
            <h4>Capacity</h4>
            <p>{apartment.capacity} Guests</p>
          </div>

          <div className="detail-card">
            <h4>Price</h4>
            <p>
              ₦
              {apartment.pricePerNight.toLocaleString()}
              /night
            </p>
          </div>

          <div className="detail-card">
            <h4>Status</h4>
            <p>{apartment.status}</p>
          </div>

        </div>
      </section>

      {/* Description */}
      <section className="description-section">
        <h2>Description</h2>

        <p>
          {apartment.description}
        </p>
      </section>

      {/* Amenities */}
      <section className="amenities-section">
        <h2>Amenities</h2>

        <div className="amenities-grid">
          {apartment.amenities?.map(
            (amenity, index) => (
              <div
                key={index}
                className="amenity-item"
              >
                ✓ {amenity}
              </div>
            )
          )}
        </div>
      </section>

      {/* House Rules */}
      <section className="rules-section">
        <h2>House Rules</h2>

        <ul className="rules-list">
          <li>✔ Check-in: 2:00 PM</li>
          <li>✔ Check-out: 11:00 AM</li>
          <li>✔ No smoking indoors</li>
          <li>✔ No parties or loud events</li>
          <li>✔ Pets are not allowed</li>
          <li>✔ Government-issued ID required at check-in</li>
          <li>✔ Please respect neighbours and property.</li>
        </ul>
      </section>

              {/* Apartment Information */}
        <div className="room-info">
          <div className="room-details">
            <h2>About this Apartment</h2>

            <p>{apartment.description}</p>

            <div className="details-grid">
              <div className="detail-card">
                <h4>Apartment Type</h4>
                <p>{apartment.apartmentType}</p>
              </div>

              <div className="detail-card">
                <h4>Capacity</h4>
                <p>{apartment.capacity} Guests</p>
              </div>

              <div className="detail-card">
                <h4>Price</h4>
                <p>
                  ₦{apartment.pricePerNight.toLocaleString()}
                  /night
                </p>
              </div>

              <div className="detail-card">
                <h4>Status</h4>
                <p
                  className={
                    apartment.status === "AVAILABLE"
                      ? "available-text"
                      : "booked-text"
                  }
                >
                  {apartment.status}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="amenities">
              <h2>Amenities</h2>

              <div className="amenities-grid">
                {apartment.amenities?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="amenity"
                    >
                      ✓ {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="booking-box">
            <h2>Book This Apartment</h2>

            <label>Check In</label>

            <input
              type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={checkIn}
              onChange={(e) =>
                setCheckIn(e.target.value)
              }
            />

            <label>Check Out</label>

            <input
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={(e) =>
                setCheckOut(e.target.value)
              }
            />

            <label>Full Name</label>

            <input
              type="text"
              placeholder="John Doe"
              value={customer.fullName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  fullName: e.target.value,
                })
              }
            />

            <label>Email Address</label>

            <input
              type="email"
              placeholder="john@example.com"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
            />

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="08012345678"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  phone: e.target.value,
                })
              }
            />

            {nights > 0 && (
              <div className="booking-summary">
                <h3>Booking Summary</h3>

                <p>
                  <strong>Nights:</strong>{" "}
                  {nights}
                </p>

                <p>
                  <strong>Price/Night:</strong> ₦
                  {apartment.pricePerNight.toLocaleString()}
                </p>

                <hr />

                <h2>
                  Total: ₦
                  {totalAmount.toLocaleString()}
                </h2>
              </div>
            )}

            <button
              className="btn pay-btn"
              disabled={
                apartment.status !==
                "AVAILABLE"
              }
              onClick={payNow}
            >
              {apartment.status ===
              "AVAILABLE"
                ? "Pay & Book"
                : "Apartment Booked"}
            </button>
          </div>
        </div>
      </section>
  );
}
