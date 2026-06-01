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
          <h1>Unlock Your Perfect Shortlet</h1>
          <p>
            Premium serviced apartments and home rentals across Nigeria.
            Comfortable, convenient, and perfectly located for business or leisure.
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
            <img src="./toimages/lusa park.jpg" alt="" />
            <h3>LUFASI Nature Park</h3>
          </div>

          <div className="attraction-card">
            <img src="./toimages/lekkibeach.jpg" alt="" />
            <h3>Lekki Beach</h3>
          </div>

          <div className="attraction-card">
            <img src="./toimages/lekkicon.jpg" alt="" />
            <h3>Lekki Conservation Centre</h3>
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
      { id: 1, name: "Apartment 1", price: "100,000" },
      { id: 2, name: "Apartment 2 (1BR)", price: "100,000" },
      { id: 3, name: "Block A", price: "130,000" },
      { id: 4, name: "Block B", price: "255,000" },
      { id: 5, name: "Apartment 3", price: "170,000" },
      { id: 6, name: "Block 3", price: "140,000" },
      { id: 7, name: "Apartment 4", price: "70,000" },
    ].map((item) => (
      <div key={item.id} className="property-card">
        <img src="./toimages/room1.jpg" alt={item.name} />

        {/* ✅ FIX: use object properties */}
        <h3>ToOSeA {item.name}</h3>
        <p>Lekki, Lagos</p>
        <span>NGN {item.price}/night</span>

        {/* ✅ FIX: pass ID in URL */}
        <Link to={`/roomdetails/${item.id}`} className="btn">
          View
        </Link>
      </div>
    ))}
  </div>
</section>

    
    </>
  );
}

export default Dashboard