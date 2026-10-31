
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, ArrowLeft, X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  singleApartment,
  deleteApartment,
} from "../../../services/apartmentApi";
import { useSelector } from "react-redux";

import "./singleApartment.css";

const SingleApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const isManager = user?.role === "MANAGER";
  const basePath = isManager ? "/manager" : "/admin";

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Submit deletion or a manager's deletion request
  const handleConfirmDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      const response = await deleteApartment(id);

      // Close the modal first so the toast is visible.
      setShowDeleteModal(false);

      toast.success(
        response?.message ||
          (isManager
            ? "Deletion request submitted successfully."
            : "Apartment deleted successfully.")
      );

      // Return to the appropriate apartment list.
      navigate(
        isManager ? "/manager/apartments" : "/admin/apartmentsview"
      );
    } catch (error) {
      // Close the modal even when the API returns an error.
      setShowDeleteModal(false);

      toast.error(
        error.response?.data?.message ||
          "Unable to process the apartment deletion. Please try again."
      );
    } finally {
      setDeleting(false);
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
            navigate(
              isManager
                ? "/manager/apartments"
                : "/admin/apartmentsview"
            )
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
                `${basePath}/apartment/edit/${apartment._id}`
              )
            }
          >
            <Edit size={18} />
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={18} />
            {isManager ? "Request Deletion" : "Delete"}
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
              {Number(
                apartment.pricePerNight || 0
              ).toLocaleString()}
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
            <p>{apartment.images?.length || 0}</p>
          </div>
        </div>

        <div className="amenities">
          <h3>Amenities</h3>

          <div className="amenity-list">
            {(apartment.amenities || []).map(
              (item, index) => (
                <span key={`${item}-${index}`}>
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="gallery">
          <h3>Apartment Images</h3>

          <div className="image-grid">
            {apartment.images?.length > 0 ? (
              apartment.images.map((image, index) => (
                <img
                  key={image.publicId || index}
                  src={image.imageUrl}
                  alt={`${apartment.name} apartment`}
                />
              ))
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={() => {
            if (!deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="delete-modal-close"
              aria-label="Close modal"
              disabled={deleting}
              onClick={() => setShowDeleteModal(false)}
            >
              <X size={20} />
            </button>

            <div className="delete-modal-icon">
              <AlertTriangle size={28} />
            </div>

            <h2 id="delete-modal-title">
              {isManager
                ? "Request Apartment Deletion?"
                : "Delete Apartment?"}
            </h2>

            <p className="delete-modal-description">
              {isManager
                ? "Your request will be sent to the owner for approval. The apartment will not be deleted until the owner approves it."
                : "Are you sure you want to delete this apartment? This action cannot be undone."}
            </p>

            <div className="delete-apartment-summary">
              <span>Apartment</span>
              <strong>{apartment.name}</strong>

              <span>Apartment Code</span>
              <strong>
                {apartment.apartmentCode || "N/A"}
              </strong>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                disabled={deleting}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={17} />
                {deleting
                  ? "Processing..."
                  : isManager
                    ? "Submit Request"
                    : "Delete Apartment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleApartment;
