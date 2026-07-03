import { useState } from "react";
import "./contacts.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    inquiry: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Message sent successfully!");
  };

  return (
    <>
     

      {/* CONTACT PAGE */}
      <section className="contact-page">
        <h1>Contact Us</h1>

        <p>We’re here to help. Reach out for bookings, inquiries, or partnerships.</p>

        <div className="contact-container">
          {/* CONTACT INFO */}
          <div className="contact-info">
            <p>
              <strong>Address:</strong> No. 10 Ajayi Apaata Estate Road, Lekki, Lagos State, Nigeria
            </p>
            <p>
              <strong>Phone:</strong> +234 802 142 9974
            </p>
            <p>
              <strong>Email:</strong> shortlet@tosae.com
            </p>
            <p>
              <strong>Support:</strong> support@toosea.com
            </p>
          </div>

          {/* FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone (+234)"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="country"
              placeholder="Country of Residence"
              value={formData.country}
              onChange={handleChange}
            />

            <select
              name="inquiry"
              value={formData.inquiry}
              onChange={handleChange}
              required
            >
              <option value="">Inquiry Type</option>
              <option value="booking">Booking</option>
              <option value="property">List a Property</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

    
    </>
  );
}

export default Contact;