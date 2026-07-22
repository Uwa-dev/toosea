import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllApartments } from "../../../services/apartmentApi";
import "./rooms.css";

const Rooms = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);

        const response = await getAllApartments();

        const allApartments = response.apartments || [];

        // Available apartments first
        const available = allApartments.filter(
          (apartment) => apartment.isActive
        );

        // Unavailable apartments last
        const unavailable = allApartments.filter(
          (apartment) => !apartment.isActive
        );

        setApartments([...available, ...unavailable]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return (
      <section className="properties">
        <h2>Loading apartments...</h2>
      </section>
    );
  }

  return (
    <section className="properties">
      <h2>Explore Our Luxury Apartments</h2>

      <div className="property-grid">
        {apartments.length === 0 ? (
          <p>No apartments available.</p>
        ) : (
          apartments.map((apartment) => (
            <div
              key={apartment._id}
              className="property-card"
            >
              <img
                src={
                  apartment.images?.[0]?.imageUrl ||
                  "/toimages/room1.jpg"
                }
                alt={apartment.name}
              />

              <div
                className={`availability-badge ${
                  apartment.isActive
                    ? "available"
                    : "booked"
                }`}
              >
                {apartment.isActive
                  ? "Available"
                  : "Booked"}
              </div>

              <div className="property-content">
                <h3>{apartment.name}</h3>

                <p>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {apartment.location || "Lekki, Lagos"}
                </p>

                <p>
                  {apartment.capacity} Guests •{" "}
                  {apartment.apartmentType}
                </p>

                <span>
                  ₦
                  {(
                    apartment.pricePerNight || 0
                  ).toLocaleString()}
                  /night
                </span>

                <Link
                  to={`/roomdetails/${apartment._id}`}
                  className="btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Rooms;