import React from "react";
import "./rooms.css";

const propertiesData = [
  {
    id: 1,
    title: "ToOSeA Apartment 1",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 1,
    price: "NGN 100,000/night",
    img: "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
    link: "/roomdetails?prop=j-luxe",
  },
  {
    id: 2,
    title: "ToOSeA Apartment 2",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 1,
    price: "NGN 100,000/night",
    img: "/toimages/pexels-living-room-1835923_1920.jpg",
    link: "/roomdetails?prop=jojo-1br",
  },
  {
    id: 3,
    title: "ToOSeA Apartment 3",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 2,
    price: "NGN 130,000/night",
    img: "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
    link: "/roomdetails?prop=jojo-2br",
  },
  {
    id: 4,
    title: "ToOSeA Apartment 4",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 1,
    price: "NGN 255,000/night",
    img: "/toimages/keresi72-room-416049_1920.jpg",
    link: "/roomdetails?prop=ikate-4br",
  },
  {
    id: 5,
    title: "ToOSeA Apartment 5",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 170,000/night",
    img: "/toimages/vale_photography-building-5523630_1920.jpg",
    link: "/roomdetails?prop=fine-duplex",
  },
  {
    id: 6,
    title: "ToOSeA Apartment 6",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 2,
    price: "NGN 140,000/night",
    img: "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
    link: "/roomdetails?prop=sangotedo-2br",
  },
  {
    id: 7,
    title: "ToOSeA Apartment 7",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 160,000/night",
    img: "/toimages/backgrountwo.jpg",
    link: "/roomdetails?prop=sangotedo-3br",
  },

    {
    id: 8,
    title: "ToOSeA Apartment 8",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 160,000/night",
    img: "/toimages/backgrountwo.jpg",
    link: "/roomdetails?prop=sangotedo-3br",
  },
];

const Rooms = () => {
  return (
    <>
     <section className="properties">
      <h2>Explore Our Luxury Apartments</h2>

      {/* PROPERTY GRID */}
      <div className="property-grid">
        {propertiesData.map((item) => (
          <div key={item.id} className="property-card">
            <img src={item.img} alt={item.title} />

            <h3>{item.title}</h3>

            <p>{item.location}</p>

            <p>
              {item.bed} Bedrooms | {item.bath} Bath
            </p>

            <span>{item.price}</span>

            <a href={item.link} className="btn">
              View Details
            </a>
          </div>
        ))}
      </div>
    </section>

    
{/* ================= NEWSLETTER ================= */}

<section className="newsletter">
  <div className="newsletter-overlay">

    <div className="newsletter-content">

      <h2>Stay Updated</h2>

      <p>
        Subscribe to our newsletter and be the first to receive exclusive
        discounts, luxury apartment offers, travel inspiration, and special
        holiday packages from ToOSeA Shortlet.
      </p>

      <form className="newsletter-form">

        <input
          type="email"
          placeholder="Enter your email address"
          required
        />

        <button type="submit">
          Subscribe
        </button>

      </form>

      <small>
        We respect your privacy. No spam, only exclusive offers.
      </small>

    </div>

  </div>
</section>

    
    </>
   
    
  );
};

export default Rooms;