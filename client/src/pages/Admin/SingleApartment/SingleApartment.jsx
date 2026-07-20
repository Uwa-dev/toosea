import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import {singleApartment} from "../../../services/apartmentApi";

import "./singleApartment.css";

const SingleApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);

  const fetchApartment = async () => {
    try {
      setLoading(true);

      const data = await singleApartment(id);

      setApartment(data.apartment);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load apartment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartment();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this apartment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteApartment(id);

      toast.success("Apartment deleted.");

      navigate("/admin/apartmentsview");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete apartment."
      );
    }
  };

  if (loading) {
    return (
      <div className="single-loading">
        Loading apartment...
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="single-loading">
        Apartment not found.
      </div>
    );
  }

  return (
    <div className="single-apartment">

      <div className="top-bar">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/apartmentsview")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="top-actions">

          <button
            className="edit-btn"
            onClick={() =>
              navigate(
                `/admin/apartment/edit/${apartment._id}`
              )
            }
          >
            <Edit size={18} />
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            Delete
          </button>

        </div>

      </div>

      <div className="single-card">

        <h1>{apartment.name}</h1>

        <span className="type">
          {apartment.apartmentType}
        </span>

        <p>{apartment.description}</p>

        <div className="details-grid">

          <div className="detail-box">
            <h4>Price</h4>
            <p>
              ₦
              {apartment.pricePerNight.toLocaleString()}
            </p>
          </div>

          <div className="detail-box">
            <h4>Capacity</h4>
            <p>{apartment.capacity} Guests</p>
          </div>

          <div className="detail-box">
            <h4>Availability</h4>

            <span
              className={
                apartment.isActive
                  ? "available"
                  : "unavailable"
              }
            >
              {apartment.isActive
                ? "Available"
                : "Unavailable"}
            </span>

          </div>

          <div className="detail-box">
            <h4>Total Images</h4>

            <p>
              {apartment.images?.length || 0}
            </p>

          </div>

        </div>

        <div className="amenities">

          <h3>Amenities</h3>

          <div className="amenity-list">

            {apartment.amenities.map((item) => (
              <span key={item}>{item}</span>
            ))}

          </div>

        </div>

        <div className="gallery">

          <h3>Apartment Images</h3>

          <div className="image-grid">

            {apartment.images.length > 0 ? (
              apartment.images.map((image) => (
                <img
                  key={image.publicId}
                  src={image.imageUrl}
                  alt="Apartment"
                />
              ))
            ) : (
              <p>No images uploaded.</p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default SingleApartment;