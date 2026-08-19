import { useEffect, useState } from "react";
import { getAllApartments } from "../../../services/apartmentApi";
import "./allApartments.css";

const AllApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);

      const response = await getAllApartments();

      setApartments(response.apartments || []);
    } catch (error) {
      console.error("Failed to fetch apartments:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load apartments."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatApartmentType = (type) => {
    if (!type) return "Standard";

    return type
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (loading) {
    return (
      <div className="reception-apartments-page">
        <div className="reception-apartments-loading">
          Loading apartments...
        </div>
      </div>
    );
  }

  return (
    <div className="reception-apartments-page">

      {/* Header */}

      <div className="reception-apartments-header">
        <div>
          <h2>All Apartments</h2>

          <p>
            View all available apartments and their details.
          </p>
        </div>

        <div className="reception-apartments-count">
          {apartments.length}{" "}
          {apartments.length === 1
            ? "Apartment"
            : "Apartments"}
        </div>
      </div>

      {/* Empty State */}

      {apartments.length === 0 ? (
        <div className="reception-apartments-empty">
          <h3>No Apartments Found</h3>

          <p>
            There are currently no active apartments.
          </p>
        </div>
      ) : (
        <div className="reception-apartments-grid">

          {apartments.map((apartment) => {
            const image =
              apartment.images?.[0]?.imageUrl ||
              "/toimages/room1.jpg";

            return (
              <div
                className="reception-apartment-card"
                key={apartment._id}
              >

                {/* Image */}

                <div className="reception-apartment-image-wrapper">

                  <img
                    src={image}
                    alt={apartment.name}
                    className="reception-apartment-image"
                  />

                  <span
                    className={`reception-apartment-status ${
                      apartment.status?.toLowerCase()
                    }`}
                  >
                    {apartment.status}
                  </span>

                </div>

                {/* Content */}

                <div className="reception-apartment-content">

                  <h3>
                    {apartment.name}
                  </h3>

                  {/* Apartment Type */}

                  <p className="reception-apartment-type">
                    {formatApartmentType(apartment.apartmentType)}
                  </p>

                  {/* Price */}

                  <div className="reception-apartment-price">
                    <span>
                      ₦
                      {apartment.pricePerNight?.toLocaleString() ||
                        "0"}
                    </span>

                    <small>
                      / night
                    </small>
                  </div>

                  {/* Details */}

                  <div className="reception-apartment-details">

                    {apartment.capacity !== undefined && (
                      <div>
                        <strong>
                          {apartment.capacity}
                        </strong>

                        <span>
                          Guests
                        </span>
                      </div>
                    )}

                    <div>
                      <strong>
                        {apartment.amenities?.length || 0}
                      </strong>

                      <span>
                        Amenities
                      </span>
                    </div>

                    <div>
                      <strong>
                        {apartment.images?.length || 0}
                      </strong>

                      <span>
                        Images
                      </span>
                    </div>

                  </div>

                  {/* Amenities */}

                  {apartment.amenities?.length > 0 && (
                    <div className="reception-apartment-amenities">

                      <h4>Amenities</h4>

                      <div className="reception-apartment-amenity-list">

                        {apartment.amenities
                          .slice(0, 5)
                          .map((amenity, index) => (
                            <span key={index}>
                              {amenity}
                            </span>
                          ))}

                        {apartment.amenities.length > 5 && (
                          <span>
                            +
                            {apartment.amenities.length - 5}
                          </span>
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default AllApartments;