import React, { useState } from "react";
import "./apartmentz.css";
import "./imageApartments.css";

const Create = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    amenities: [],
    images: [],
  });

  const amenitiesList = [
    "WiFi",
    "Swimming Pool",
    "Air Conditioning",
    "Kitchen",
    "Parking",
    "Smart TV",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: [...e.target.files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Call your API here
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <div className="form-header">
              <h1>Create Apartment</h1>
              <p>
                Fill in the apartment information before proceeding to upload
                images.
              </p>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Apartment Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="5"
                name="description"
                placeholder="Apartment Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price (₦)</label>
              <input
                type="number"
                name="price"
                placeholder="50000"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="4 Guests"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Amenities</label>

              <div className="checkboxes">
                {amenitiesList.map((amenity) => (
                  <label key={amenity}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <div className="form-header">
              <h1>Apartment Images</h1>
              <p>Upload images for the apartment.</p>
            </div>

            <div className="form-group">
              <label>Upload Apartment Images</label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="buttons">
              <button
                type="button"
                onClick={() => setStep(1)}
              >
                Previous
              </button>

              <button type="submit">
                Create Apartment
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Create;