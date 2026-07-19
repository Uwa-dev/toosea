import React, { useState } from "react";
import { toast } from "react-toastify";
import "./apartmentz.css";
import "./imageApartments.css";
import Load from "../../../components/reuse/Load.jsx";
import {
  createApartment,
  uploadApartmentImages,
} from "../../../services/apartmentApi.js";

const Create = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    apartmentType: "STANDARD",
    pricePerNight: "",
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

  // Prevent negative values from being entered
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "pricePerNight" || name === "capacity") &&
      Number(value) < 0
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Prevent typing -, +, e and E
  const preventNegativeInput = (e) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
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
      images: Array.from(e.target.files),
    }));
  };

  const handleNext = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.pricePerNight ||
      !formData.capacity
    ) {
      toast.warning("Please complete all required fields.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.warning("Please upload at least one apartment image.");
      return;
    }

    try {
      setLoading(true);

      const apartmentResponse = await createApartment({
        name: formData.name,
        description: formData.description,
        apartmentType: formData.apartmentType,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        amenities: formData.amenities,
      });

      const apartmentId = apartmentResponse.apartment._id;

      await uploadApartmentImages(
        apartmentId,
        formData.images
      );

      toast.success("Apartment created successfully!");

      setFormData({
        name: "",
        description: "",
        apartmentType: "STANDARD",
        pricePerNight: "",
        capacity: "",
        amenities: [],
        images: [],
      });

      setStep(1);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create apartment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Load />}

      <div className="container">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-header">
                <h1>Create Apartment</h1>
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
                <label>Apartment Type</label>

                <select
                  name="apartmentType"
                  value={formData.apartmentType}
                  onChange={handleChange}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="EXECUTIVE">Executive</option>
                  <option value="PENTHOUSE">Penthouse</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price Per Night (₦)</label>

                <input
                  type="number"
                  name="pricePerNight"
                  placeholder="50000"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  onKeyDown={preventNegativeInput}
                  min="1"
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
                  onKeyDown={preventNegativeInput}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Amenities</label>

                <div className="checkboxes">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity}>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(
                          amenity
                        )}
                        onChange={() =>
                          handleAmenityChange(amenity)
                        }
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-header">
                <h1>Apartment Images</h1>

                <p>
                  Upload at least one apartment image.
                </p>
              </div>

              <div className="form-group">
                <label>Upload Images</label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              {formData.images.length > 0 && (
                <p>
                  {formData.images.length} image(s) selected.
                </p>
              )}

              <div className="buttons">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Previous
                </button>

                <button
                  type="submit"
                  disabled={loading}
                >
                  Create Apartment
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Create;