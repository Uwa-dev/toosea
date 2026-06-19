// import React from 'react'
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   return (
   
//   )
// }

// export default Dashboard

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";


const  Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "./toimages/background.jpg",
    "./toimages/backgrountwo.jpg",
    "./toimages/jarmoluk-bathroom-2094716_1920.jpg",
    "./toimages/jarmoluk-kitchen-2094723_1920 (1).jpg"
  ];

  /* --- HERO SLIDER --- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* --- PROPERTY FILTER --- */
  const handleFilter = (filter) => {
    const cards = document.querySelectorAll(".property-card");
    cards.forEach((card) => {
      if (filter === "all" || card.dataset.bed === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  /* --- PROPERTY DETAIL GALLERY --- */
  const changeSlide = (src) => {
    const main = document.getElementById("galleryMain");
    if (main) main.src = src;
  };

  return (
    <>
     

      {/* HERO */}
      <section className="hero">
        <div className="hero-slider">
          {slides.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`slide ${i === currentSlide ? "active" : ""}`}
              alt="Luxury Shortlet"
            />
          ))}
        </div>

        <div className="hero-content">
          <h1>Luxury comfort in the heart of Lagos Island</h1>
          <p>
            ToOseA provides a stylish Airbnd experience with modern amenities,
            exceptional hospitality, and easy access to the city's top destinations
            which is perfect for business trips,weekend getaways, and unforgettable stays.
          </p>

          <div className="hero-buttons">
            <a href="/properties" className="btn">Explore Apartment</a>
            <a href="#" className="btn">Premium services</a>
            <a href="#" className="btn">Luxury</a>
          </div>

          <div className="trust-indicators">
            <div>✔ Secure Payment Handling</div>
            <div>✔ CAC Certified</div>
            <div>✔ SCUML Compliant</div>
            <div>✔ Exceptional Customer Service</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>About ToOSeA Shortlet</h2>
        <p>
          ToOSeA Shortlet is Nigeria’s premier property management and short stay rental company,
          delivering comfort, convenience, and exceptional service.
        </p>
        <p>
          Empirean Heights Ltd. is fully registered with CAC, FIRS, and SCUML
          and compliant with all regulatory standards in Nigeria.
        </p>
      </section>

      {/* ATTRACTIONS */}
    <section className="attractions">
  <h2>Nearby Attractions</h2>

  <div className="attraction-grid">

    <div className="attraction-card">
      <img src="./toimages/lufasi-park.jpg" alt="LUFASI Nature Park" />
      <h3>LUFASI Nature Park</h3>
      <p>Beautiful wildlife park with nature trails and family activities.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/lekkicon.jpg" alt="Lekki Conservation Centre" />
      <h3>Lekki Conservation Centre</h3>
      <p>Experience Africa's famous canopy walkway and serene nature reserve.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/novare-mall.jpg" alt="Novare Lekki Mall" />
      <h3>Novare Lekki Mall</h3>
      <p>Shopping, restaurants, cinema, and entertainment just minutes away.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/atican-beach.jpg" alt="Atican Beach" />
      <h3>Atican Beach</h3>
      <p>One of Lagos' most peaceful beaches for relaxation and fun.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/lekki-art-market.jpg" alt="Lekki Arts & Crafts Market" />
      <h3>Lekki Arts & Crafts Market</h3>
      <p>Discover authentic Nigerian art, souvenirs, and handcrafted items.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/omu-resort.jpg" alt="Omu Resort" />
      <h3>Omu Resort</h3>
      <p>A complete family destination featuring a zoo, amusement park, and water activities.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/lakowe-golf.jpg" alt="Lakowe Lakes Golf Estate" />
      <h3>Lakowe Lakes Golf Estate</h3>
      <p>Premium golf course with lakeside scenery and luxury ambience.</p>
    </div>

    <div className="attraction-card">
      <img src="./toimages/eleko-beach.jpg" alt="Eleko Beach" />
      <h3>Eleko Beach</h3>
      <p>Enjoy a quieter beach experience with ocean views and fresh seafood.</p>
    </div>

  </div>
</section>

      {/* SERVICES */}
      <section className="services">
        <h2>Our Services</h2>

        <div className="service-grid">
          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-car"></i><br />
              Free Parking
              <p style={{ color: "#555", lineHeight: 1.6 }}>
                Enjoy secure and spacious parking at no extra cost throughout your stay.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-spa"></i><br />
              Luxury Spa
              <p style={{ color: "#555", lineHeight: 1.6 }}>
                Rejuvenate your body and mind with our premium spa treatments designed for total relaxation.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-tree"></i><br />
              Garden Lounge
              <p style={{ color: "#555", lineHeight: 1.6 }}>
                Relax in our serene outdoor garden space perfect for quiet moments and social gatherings.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-champagne-glasses"></i><br />
              Event space
              <p style={{ color: "#555", lineHeight: 1.6 }}>
                Host memorable events in our elegant and fully equipped event space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTIES */}
     <section className="properties">
  <h2>Featured Luxury Apartments</h2>

  <div className="property-grid">
    {[
  {
    id: 1,
    name: "Apartment 1",
    price: "100,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=j-luxe",
  },
  {
    id: 2,
    name: "Apartment 2",
    price: "100,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=jojo-1br",
  },
  {
    id: 3,
    name: "Block A",
    price: "130,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=jojo-2br",
  },
  {
    id: 4,
    name: "Block B",
    price: "255,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=ikate-4br",
  },
  {
    id: 5,
    name: "Apartment 3",
    price: "170,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=fine-duplex",
  },
  {
    id: 6,
    name: "Block 3",
    price: "140,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=sangotedo-2br",
  },
  {
    id: 7,
    name: "Apartment 4",
    price: "70,000",
    img: "./toimages/room1.jpg",
    link: "/roomdetails?prop=sangotedo-3br",
  },
].map((item) => (
      <div key={item.id} className="property-card">
        <img src="./toimages/room1.jpg" alt={item.name} />

        {/* ✅ FIX: use object properties */}
        <h3>ToOSeA {item.name}</h3>
        <p>Lekki, Lagos</p>
        <span>NGN {item.price}/night</span>

        {/* ✅ FIX: pass ID in URL */}
       <Link to={item.link} className="btn">
    View Details
</Link>
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
}

export default Dashboard