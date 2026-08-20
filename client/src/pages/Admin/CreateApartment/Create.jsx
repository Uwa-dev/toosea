import React, { useState } from "react";
import { toast } from "react-toastify";
import "./apartmentz.css";
import Load from "../../../components/reuse/Load.jsx";
import {
  createApartment,
  uploadApartmentImages,
} from "../../../services/apartmentApi.js";

const Create = ({ role }) => {
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

  const isManager = role === "MANAGER";

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
    const files = Array.from(e.target.files);

    if (files.length > 15) {
      toast.warning("You can upload a maximum of 15 images.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: files,
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

    if (formData.images.length > 15) {
      toast.warning("Maximum of 15 images allowed.");
      return;
    }

    try {
      setLoading(true);

      /*
       * We DO NOT send approvalStatus or createdBy
       * from the frontend.
       *
       * The backend gets the logged-in user from req.user
       * and determines:
       *
       * OWNER   → APPROVED
       * MANAGER → PENDING
       */

      const apartmentResponse = await createApartment({
        name: formData.name.trim(),
        description: formData.description.trim(),
        apartmentType: formData.apartmentType,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        amenities: formData.amenities,
      });

      const apartmentId = apartmentResponse.apartment._id;

      // Upload images after apartment has been created
      await uploadApartmentImages(
        apartmentId,
        formData.images
      );

      /*
       * Use the message returned by the backend.
       *
       * OWNER:
       * "Apartment created successfully."
       *
       * MANAGER:
       * "Apartment submitted successfully and is awaiting owner approval."
       */
      toast.success(
        apartmentResponse.message ||
          (
            isManager
              ? "Apartment submitted successfully and is awaiting owner approval."
              : "Apartment created successfully."
          )
      );

      // Reset form
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

      <div className="create-apartment-page">
        <div className="create-apartment-card">

          <form onSubmit={handleSubmit}>

            {/* ================= STEP 1 ================= */}

            {step === 1 && (
              <div className="apartment-step">

                <div className="apartment-form-header">
                  <h1>
                    {isManager
                      ? "Submit Apartment"
                      : "Create Apartment"}
                  </h1>

                  <p>
                    {isManager
                      ? "Enter the apartment details for owner approval."
                      : "Enter the details of the new apartment."}
                  </p>
                </div>

                <div className="apartment-form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Apartment Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="apartment-form-group">
                  <label>Description</label>

                  <textarea
                    rows="5"
                    name="description"
                    placeholder="Apartment Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="apartment-form-group">
                  <label>Apartment Type</label>

                  <select
                    name="apartmentType"
                    value={formData.apartmentType}
                    onChange={handleChange}
                  >
                    <option value="STANDARD">
                      Standard
                    </option>

                    <option value="DELUXE">
                      Deluxe
                    </option>

                    <option value="EXECUTIVE">
                      Executive
                    </option>

                    <option value="SUITE">
                      Suite
                    </option>

                    <option value="PRESIDENTIAL">
                      Presidential
                    </option>
                  </select>
                </div>

                <div className="apartment-form-row">

                  <div className="apartment-form-group">
                    <label>
                      Price Per Night (₦)
                    </label>

                    <input
                      type="number"
                      name="pricePerNight"
                      placeholder="50000"
                      value={formData.pricePerNight}
                      onChange={handleChange}
                      onKeyDown={preventNegativeInput}
                      min="1"
                      required
                    />
                  </div>

                  <div className="apartment-form-group">
                    <label>Capacity</label>

                    <input
                      type="number"
                      name="capacity"
                      placeholder="4 Guests"
                      value={formData.capacity}
                      onChange={handleChange}
                      onKeyDown={preventNegativeInput}
                      min="1"
                      required
                    />
                  </div>

                </div>

                <div className="apartment-form-group">

                  <label>Amenities</label>

                  <div className="apartment-checkboxes">

                    {amenitiesList.map((amenity) => (
                      <label
                        className="amenity-option"
                        key={amenity}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityChange(amenity)
                          }
                        />

                        <span>{amenity}</span>
                      </label>
                    ))}

                  </div>

                </div>

                <button
                  className="apartment-next-btn"
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </button>

              </div>
            )}

            {/* ================= STEP 2 ================= */}

            {step === 2 && (
              <div className="apartment-step">

                <div className="apartment-form-header">

                  <h1>Apartment Images</h1>

                  <p>
                    {isManager
                      ? "Upload the apartment images for owner approval."
                      : "Upload at least one image of the apartment."}
                  </p>

                </div>

                <div className="apartment-form-group">

                  <label>
                    Upload Images
                  </label>

                  <div className="apartment-file-wrapper">

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />

                  </div>

                  <small>
                    Maximum of 15 images.
                  </small>

                </div>

                {formData.images.length > 0 && (
                  <div className="selected-images">

                    <span className="selected-images-count">
                      {formData.images.length}
                    </span>

                    <span>
                      image
                      {formData.images.length > 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </span>

                  </div>
                )}

                <div className="apartment-buttons">

                  <button
                    className="apartment-prev-btn"
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Previous
                  </button>

                  <button
                    className="apartment-submit-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? isManager
                        ? "Submitting..."
                        : "Creating..."
                      : isManager
                        ? "Submit for Approval"
                        : "Create Apartment"}
                  </button>

                </div>

              </div>
            )}

          </form>

        </div>
      </div>
    </>
  );
};

export default Create;