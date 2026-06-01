import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./roomdetail.css";

/* =========================
   PROPERTY DATA WITH 4 IMAGES EACH
========================= */
const properties = {
  "j-luxe": {
    title: "ToOSeA Apartment 1",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: "NGN 100,000/night",
    images: [
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
    ],
  },

  "jojo-1br": {
    title: "ToOSeA Apartment 2",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: "NGN 100,000/night",
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
    bed: 2,
    bath: 2,
    price: "NGN 130,000/night",
    images: [
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
    ],
  },

  "ikate-4br": {
    title: "ToOSeA Apartment 4",
    location: "Lekki, Lagos",
    bed: 4,
    bath: 4,
    price: "NGN 255,000/night",
    images: [
      "/toimages/keresi72-room-416049_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
    ],
  },

  "fine-duplex": {
    title: "ToOSeA Apartment 5",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 170,000/night",
    images: [
      "/toimages/vale_photography-building-5523630_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
    ],
  },

  "sangotedo-2br": {
    title: "ToOSeA Apartment 6",
    location: "Lekki, Lagos",
    bed: 2,
    bath: 2,
    price: "NGN 140,000/night",
    images: [
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
    ],
  },

  "sangotedo-3br": {
    title: "ToOSeA Apartment 7",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 160,000/night",
    images: [
      "/toimages/backgrountwo.jpg",
      "/toimages/keresi72-room-416049_1920.jpg",
      "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
      "/toimages/pexels-living-room-1835923_1920.jpg",
    ],
  },
};

export default function RoomDetail() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const propKey = query.get("prop");

  const property = properties[propKey];

  const [currentIndex, setCurrentIndex] = useState(0);

  /* AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        (prev + 1) % property.images.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [property]);

  if (!property) return <h2>Property not found</h2>;

  return (
    <section className="room-detail">
      <h1>{property.title}</h1>
      <p className="location">{property.location}</p>

      {/* SLIDESHOW */}
      <div className="slider">
        <img
          src={property.images[currentIndex]}
          alt="room"
          className="main-image"
        />

        {/* THUMBNAILS */}
        <div className="thumbnails">
          {property.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              onClick={() => setCurrentIndex(index)}
              className={currentIndex === index ? "active" : ""}
            />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <p>{property.bed} Bed | {property.bath} Bath</p>
      <p className="price">{property.price}</p>

      {/* ACTION */}
      <div className="actions">
        <a href="#" className="btn">Book Now</a>
      </div>
    </section>
  );
}