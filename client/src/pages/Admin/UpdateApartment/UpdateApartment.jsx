import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  singleApartment,
  updateApartment,
} from "../../../services/apartmentApi";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import "./updateApartment.css";

const APARTMENT_TYPES = [
  "STANDARD",
  "DELUXE",
  "EXECUTIVE",
  "SUITE",
  "PRESIDENTIAL"
];


const UpdateApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    apartmentType: "STANDARD",
    pricePerNight: "",
    capacity: "",
    amenities: []
  });

  const [amenitiesInput, setAmenitiesInput] = useState("");

  useEffect(() => {
    const fetchApartment = async () => {
    try {
        setLoading(true);
        setError("");

        const response = await singleApartment(id);

        const apartment =
        response.apartment ||
        response.data ||
        response;

        if (!apartment?._id) {
        throw new Error("Apartment details could not be loaded.");
        }

        setFormData({
        name: apartment.name || "",
        description: apartment.description || "",
        apartmentType: apartment.apartmentType || "STANDARD",
        pricePerNight: apartment.pricePerNight ?? "",
        capacity: apartment.capacity ?? "",
        amenities: apartment.amenities || [],
        });

        setAmenitiesInput(
        (apartment.amenities || []).join(", ")
        );
    } catch (err) {
        const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load apartment details.";

        setError(message);
        toast.error(message);
    } finally {
        setLoading(false);
    }
    };

    if (id) {
      fetchApartment();
    } else {
      setError("Apartment ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (event) => {
    setAmenitiesInput(event.target.value);
  };


    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsPending(false);

    if (
        !formData.name.trim() ||
        !formData.description.trim() ||
        formData.pricePerNight === "" ||
        formData.capacity === ""
    ) {
        toast.error("Please complete all required fields.");
        return;
    }

    const price = Number(formData.pricePerNight);
    const capacity = Number(formData.capacity);

    if (!Number.isFinite(price) || price < 1) {
        toast.error("Price per night must be greater than zero.");
        return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
        toast.error("Capacity must be a positive whole number.");
        return;
    }

    const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        apartmentType: formData.apartmentType,
        pricePerNight: price,
        capacity,
        amenities: amenitiesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
    setSaving(true);

    const response = await updateApartment(id, payload);


    const message =
        response.message || "Apartment update submitted successfully.";

    const pending =
        message.toLowerCase().includes("pending") ||
        message.toLowerCase().includes("awaiting") ||
        message.toLowerCase().includes("approval");

    setIsPending(pending);
    setSuccess(message);

    if (pending) {
        toast.info(message);
    } else {
        toast.success(message);
    }
    } catch (err) {

    const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update apartment. Please try again.";

    setError(message);
    toast.error(message);
    } finally {
    setSaving(false);
    }

    };


  if (loading) {
    return (
      <div className="update-apartment-page">
        <div className="update-apartment-loading">
          <LoaderCircle className="update-spin" size={30} />
          <p>Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="update-apartment-page">
        <div className="update-apartment-card update-apartment-error-card">
          <CircleAlert size={32} />
          <h2>Unable to load apartment</h2>
          <p>{error}</p>
          <button
            type="button"
            className="update-btn update-btn-primary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="update-apartment-page">
      <div className="update-apartment-container">
        <button
          type="button"
          className="update-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <header className="update-apartment-header">
          <div className="update-header-icon">
            <Building2 size={27} />
          </div>

          <div>
            <span className="update-eyebrow">APARTMENT MANAGEMENT</span>
            <h1>Update Apartment</h1>
            <p>
              Edit apartment information and save your changes.
            </p>
          </div>
        </header>

        {error && (
          <div className="update-alert update-alert-error" role="alert">
            <CircleAlert size={20} />
            <span>{error}</span>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div
            className={`update-alert ${
              isPending
                ? "update-alert-pending"
                : "update-alert-success"
            }`}
            role="status"
          >
            <CheckCircle2 size={21} />
            <div>
              <strong>
                {isPending
                  ? "Awaiting owner approval"
                  : "Update successful"}
              </strong>
              <p>{success}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setSuccess("")}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form
          className="update-apartment-card"
          onSubmit={handleSubmit}
        >
          <div className="update-card-heading">
            <div>
              <h2>Apartment Information</h2>
              <p>
                Update the details below. Fields marked with * are required.
              </p>
            </div>
          </div>

          <div className="update-form-grid">
            <div className="update-form-group update-full-width">
              <label htmlFor="name">Apartment Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Paris Apartment"
                required
                maxLength={100}
              />
            </div>

            <div className="update-form-group update-full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the apartment and its features..."
                rows={5}
                required
              />
            </div>

            <div className="update-form-group">
              <label htmlFor="apartmentType">Apartment Type *</label>
              <select
                id="apartmentType"
                name="apartmentType"
                value={formData.apartmentType}
                onChange={handleChange}
                required
              >
                {APARTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="update-form-group">
              <label htmlFor="pricePerNight">
                Price Per Night (₦) *
              </label>
              <input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                min="1"
                step="1"
                value={formData.pricePerNight}
                onChange={handleChange}
                placeholder="60000"
                required
              />
            </div>

            <div className="update-form-group">
              <label htmlFor="capacity">Guest Capacity *</label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                step="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="2"
                required
              />
              <small>Maximum number of guests allowed.</small>
            </div>

            <div className="update-form-group update-full-width">
              <label htmlFor="amenities">Amenities</label>
              <textarea
                id="amenities"
                value={amenitiesInput}
                onChange={handleAmenitiesChange}
                placeholder="Free Wi-Fi, Air conditioning, DSTV, Free Parking"
                rows={3}
              />
              <small>
                Separate each amenity with a comma.
              </small>

              <div className="update-amenities-preview">
                {amenitiesInput
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((amenity, index) => (
                    <span key={`${amenity}-${index}`}>
                      {amenity}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="update-form-footer">
            <button
              type="button"
              className="update-btn update-btn-secondary"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-btn update-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="update-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        <p className="update-apartment-note">
          Apartment photos are managed separately from this page.
        </p>
      </div>
    </div>
  );
};

export default UpdateApartment;
