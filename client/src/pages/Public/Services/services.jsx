import { useState } from "react";
import "./services.css";

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* OVERLAY */}
    

      {/* NAVBAR */}
   
      {/* MAIN SECTION */}
      <section className="section">
        <h2>Our Services</h2>

        <div className="grid">
          {[
            "High-Speed Wifi",
            "Smart Entertainment",
            "Uninterrupted Electricity",
            "Premuim Appliances",
            "Air Conditioning",
            "Privacy",
            "Security",
            "Relaxation",
          ].map((service, index) => (
            <div key={index} className="card">
              {service}
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