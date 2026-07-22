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
    </>
  );
}