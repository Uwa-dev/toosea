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
            "Luxury Spa",
            "Gourmet Dining",
            "Poolside Bar",
            "Event Planning",
            "Outdoor Activities",
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