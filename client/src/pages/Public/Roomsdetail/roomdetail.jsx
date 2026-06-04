import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";
import "./roomdetail.css";

/* PROPERTY DATA */
const properties = {
  "j-luxe": {
    title: "ToOSeA Apartment 1",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: 100000,
    images: [
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
       "/toimages/keresi72-room-416049_1920.jpg",
        "/toimages/keresi72-room-416049_1920.jpg",
         "/toimages/keresi72-room-416049_1920.jpg",
          "/toimages/keresi72-room-416049_1920.jpg",
           "/toimages/keresi72-room-416049_1920.jpg",
            "/toimages/keresi72-room-416049_1920.jpg",
             "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

  "jojo-1br": {
    title: "ToOSeA Apartment 2",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

    "jojo-2br": {
    title: "ToOSeA Apartment 3",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

    "ikate-4br": {
    title: "ToOSeA Apartment 4",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

   "fine-duplex": {
    title: "ToOSeA Apartment 5",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },  

   "sangotedo-2br": {
    title: "ToOSeA Apartment 6",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

  
   "sangotedo-3br": {
    title: "ToOSeA Apartment 7",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

  "sangotedo-3br": {
    title: "ToOSeA Apartment 8",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: 100000,
    images: [
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },
};

export default function RoomDetail() {
  const location = useLocation();
  const prop = new URLSearchParams(location.search).get("prop");

  const property = properties[prop];

  const [currentIndex, setCurrentIndex] = useState(0);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % property.images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [property]);

  if (!property) return <h2>Property not found</h2>;

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalAmount = nights * property.price;

  const payNow = () => {
    if (!checkIn || !checkOut) {
      alert("Select dates first");
      return;
    }

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "YOUR_PAYSTACK_PUBLIC_KEY",

      email: "customer@email.com",

      amount: totalAmount * 100,

      currency: "NGN",

      onSuccess: () => {
        alert("Booking successful");

        console.log({
          property: property.title,
          checkIn,
          checkOut,
          nights,
        });
      },

      onCancel: () => {
        alert("Payment cancelled");
      },
    });
  };

  return (
    <section className="room-detail">
      <h1>{property.title}</h1>

      <p>{property.location}</p>

      <div className="slider">
        <img
          src={property.images[currentIndex]}
          className="main-image"
        />

        <div className="thumbnails">
          {property.images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setCurrentIndex(i)}
              className={
                currentIndex === i ? "active" : ""
              }
            />
          ))}
        </div>
      </div>

      <p>
        {property.bed} Bed | {property.bath} Bath
      </p>

      <h2>
        NGN {property.price.toLocaleString()}/night
      </h2>

      <div className="booking-box">
        <h3>Select Booking Dates</h3>

        <label>Check In</label>

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
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

        {nights > 0 && (
          <div>
            <p>{nights} Nights</p>

            <h3>
              Total: NGN{" "}
              {totalAmount.toLocaleString()}
            </h3>
          </div>
        )}

        <button
          className="btn"
          onClick={payNow}
        >
          Pay & Book with Paystack
        </button>
      </div>
    </section>
  );
}