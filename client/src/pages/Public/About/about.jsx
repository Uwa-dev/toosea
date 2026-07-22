import React, { useState } from "react";
import "./about.css";

const About = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing: ${email}`);
    setEmail("");
  };

  return (
    <>
      
      {/* ABOUT SECTION */}
      <section className="about-page">
        <h1>About ToOSeA Shortlet</h1>

        <p>
          ToOSeA Shortlet is Nigeria’s premier property management and short
          stay rental company, delivering comfort, convenience, and exceptional
          service. Our mission is to provide luxurious, safe, and fully
          serviced apartments across Nigeria.
        </p>

        <div className="about-sections">
          <div className="about-section">
            <h2>Our Vision</h2>
            <p>
              To provide a comfortable and reliable stay where guests can enjoy quality
              hospitality, modern living, and a stress free experience from 
              booking to check out 
            </p>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We aim to become one of most trusted Airbnb brands on Lagos 
              Island by consistently delivering excellent service, beautiful spaces,
              and memorable guest experiences.
            </p>
          </div>

          <div className="about-section">
            <h2>Regulatory Compliance</h2>
            <p>
              Empirean Heights Ltd. is fully registered with CAC, FIRS, and
              SCUML, compliant with all regulatory standards in Nigeria.
            </p>
          </div>
        </div>
      </section>

    </>
  );
};

export default About;