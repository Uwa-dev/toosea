import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  Trash2,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  singleApartment,
  uploadApartmentImages,
  deleteApartmentImage,
} from "../../../services/apartmentApi.js";

import "./apartmentImages.css";

const ApartmentImages = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apartment, setApartment] =
    useState(null);

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [previewUrls, setPreviewUrls] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingImageId, setDeletingImageId] =
    useState(null);

  const fetchApartment = async () => {
    try {
      setLoading(true);

      const data =
        await singleApartment(id);

      setApartment(data.apartment);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch apartment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartment();
  }, [id]);

  // Create previews when files are selected
  useEffect(() => {
    const urls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [selectedFiles]);

  const currentImages =
    apartment?.images || [];

  const remainingSlots =
    15 - currentImages.length;

  const handleFileChange = (e) => {
    const files = Array.from(
      e.target.files
    );

    if (files.length === 0) {
      return;
    }

    if (files.length > remainingSlots) {
      toast.error(
        `You can only add ${remainingSlots} more image${
          remainingSlots === 1
            ? ""
            : "s"
        }.`
      );

      e.target.value = "";
      return;
    }

    setSelectedFiles(files);

    // Allow selecting the same files again
    e.target.value = "";
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((current) =>
      current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  };

  const handleDeleteImage = async (image) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    try {
      setDeletingImageId(image.publicId);

      const data = await deleteApartmentImage(
        id,
        image.publicId
      );

      toast.success(
        data.message ||
          "Image deleted successfully."
      );

      setApartment((current) => ({
        ...current,
        images: current.images.filter(
          (item) =>
            item.publicId !== image.publicId
        ),
      }));

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete image."
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error(
        "Please select at least one image."
      );

      return;
    }

    if (
      currentImages.length +
        selectedFiles.length >
      15
    ) {
      toast.error(
        "An apartment cannot have more than 15 images."
      );

      return;
    }

    try {
      setUploading(true);

      const data =
        await uploadApartmentImages(
          id,
          selectedFiles
        );

      toast.success(
        data.message ||
          "Images uploaded successfully."
      );

      setSelectedFiles([]);

      await fetchApartment();

    } catch (error) {
      console.error(
        "Upload Images Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload images."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="apartment-images-page loading-page">
        <div className="loading-content">
          <Camera size={40} />
          <h2>
            Loading apartment...
          </h2>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="apartment-images-page">
        <div className="empty-page">
          <Camera size={50} />
          <h2>
            Apartment not found
          </h2>

          <button
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apartment-images-page">

      {/* HEADER */}

      <div className="images-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="header-content">
          <h1>
            {apartment.name}
          </h1>

          <p>
            Manage apartment images
          </p>
        </div>

      </div>

      {/* IMAGE COUNT */}

      <div className="image-count-card">

        <div className="count-info">
          <div className="count-icon">
            <Camera size={22} />
          </div>

          <div>
            <h3>
              Apartment Images
            </h3>

            <p>
              {currentImages.length}{" "}
              of 15 images uploaded
            </p>
          </div>
        </div>

        <div className="count-status">

          {remainingSlots > 0 ? (
            <>
              <strong>
                {remainingSlots}
              </strong>

              <span>
                slot
                {remainingSlots === 1
                  ? ""
                  : "s"} remaining
              </span>
            </>
          ) : (
            <span className="full">
              Maximum reached
            </span>
          )}

        </div>

      </div>

      {/* PROGRESS */}

      <div className="image-progress">

        <div
          className="image-progress-bar"
          style={{
            width: `${
              (currentImages.length /
                15) *
              100
            }%`,
          }}
        />

      </div>

      {/* CURRENT IMAGES */}

      <div className="images-section">

        <div className="section-heading">
          <div>
            <h2>
              Current Images
            </h2>

            <p>
              Click the delete button
              to remove an image.
            </p>
          </div>
        </div>

        {currentImages.length === 0 ? (
          <div className="no-images">

            <Camera size={45} />

            <h3>
              No images uploaded
            </h3>

            <p>
              Upload images using the
              section below.
            </p>

          </div>
        ) : (

          <div className="image-grid">

            {currentImages.map((image, index) => (
              <div
                className="image-card"
                key={image.publicId}
              >
                <div className="image-wrapper">

                  <img
                    src={image.imageUrl}
                    alt={`${apartment.name} ${index + 1}`}
                  />

                  <div className="image-number">
                    {index + 1}
                  </div>

                  <button
                    className="delete-image-btn"
                    onClick={() =>
                      handleDeleteImage(image)
                    }
                    disabled={
                      deletingImageId === image.publicId
                    }
                    title="Delete image"
                  >
                    {deletingImageId === image.publicId ? (
                      "..."
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>

                </div>

                <div className="image-card-footer">
                  <span>
                    Image {index + 1}
                  </span>
                </div>
              </div>
            ))}

          </div>

        )}

      </div>

      {/* UPLOAD SECTION */}

      {remainingSlots > 0 && (

        <div className="upload-section">

          <div className="section-heading">

            <div>
              <h2>
                Add More Images
              </h2>

              <p>
                Add up to{" "}
                <strong>
                  {remainingSlots}
                </strong>{" "}
                more image
                {remainingSlots === 1
                  ? ""
                  : "s"}.
              </p>
            </div>

          </div>

          {/* FILE SELECTOR */}

          <label className="upload-box">

            <div className="upload-icon">
              <Upload size={30} />
            </div>

            <h3>
              Select Images
            </h3>

            <p>
              Click here to select
              images from your device
            </p>

            <small>
              You can select up to{" "}
              {remainingSlots}{" "}
              image
              {remainingSlots === 1
                ? ""
                : "s"}
            </small>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleFileChange
              }
            />

          </label>

          {/* SELECTED FILES */}

          {selectedFiles.length >
            0 && (

            <div className="selected-files">

              <div className="selected-header">
                <h3>
                  Selected Images
                </h3>

                <span>
                  {
                    selectedFiles.length
                  }{" "}
                  selected
                </span>
              </div>

              <div className="selected-grid">

                {selectedFiles.map(
                  (file, index) => (

                    <div
                      className="selected-image"
                      key={`${file.name}-${index}`}
                    >

                      <img
                        src={
                          previewUrls[index]
                        }
                        alt={file.name}
                      />

                      <button
                        type="button"
                        className="remove-selected"
                        onClick={() =>
                          removeSelectedFile(
                            index
                          )
                        }
                        title="Remove selected image"
                      >
                        <X size={16} />
                      </button>

                      <span>
                        {file.name}
                      </span>

                    </div>

                  )
                )}

              </div>

              <button
                className="upload-btn"
                onClick={
                  handleUpload
                }
                disabled={uploading}
              >
                <Upload size={18} />

                {uploading
                  ? "Uploading..."
                  : `Upload ${
                      selectedFiles.length
                    } Image${
                      selectedFiles.length ===
                      1
                        ? ""
                        : "s"
                    }`}
              </button>

            </div>

          )}

        </div>

      )}

      {/* MAXIMUM REACHED */}

      {remainingSlots === 0 && (

        <div className="maximum-message">

          <div className="maximum-icon">
            <Camera size={30} />
          </div>

          <div>
            <h3>
              Maximum number of images
              reached
            </h3>

            <p>
              This apartment has 15
              images. Delete an existing
              image if you want to upload
              a replacement.
            </p>
          </div>

        </div>

      )}

    </div>
  );
};

export default ApartmentImages;