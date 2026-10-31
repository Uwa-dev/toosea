
import axios from "axios";

export const apartmentApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/apartment`,
});

// Attach JWT token to every request
apartmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================
// APARTMENT CRUD
// ==============================

// Create apartment
// OWNER: immediately approved
// MANAGER: pending owner approval
export const createApartment = async (data) => {
  const response = await apartmentApi.post("/", data);
  return response.data;
};

// Get all active apartments
export const getAllApartments = async () => {
  const response = await apartmentApi.get("/");
  return response.data;
};

// Get a single apartment
export const singleApartment = async (id) => {
  const response = await apartmentApi.get(`/${id}`);
  return response.data;
};

// Update apartment
// OWNER: changes immediately
// MANAGER: submits changes for approval
export const updateApartment = async (id, apartmentData) => {
  const response = await apartmentApi.put(`/${id}`, apartmentData);
  return response.data;
};

// Delete apartment or submit deletion request
// OWNER: deletes immediately
// MANAGER: submits request for approval
export const deleteApartment = async (id) => {
  const response = await apartmentApi.delete(`/${id}`);
  return response.data;
};

// ==============================
// APARTMENT IMAGES
// ==============================

// Upload apartment images
export const uploadApartmentImages = async (id, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apartmentApi.post(`/${id}/images`, formData);

  return response.data;
};

// Delete an apartment image (OWNER only)
export const deleteApartmentImage = async (apartmentId, publicId) => {
  const response = await apartmentApi.delete(
    `/${apartmentId}/images/${encodeURIComponent(publicId)}`
  );

  return response.data;
};

// ==============================
// OWNER: APARTMENT APPROVALS
// ==============================

// Get pending apartment creation requests
export const getPendingApartments = async () => {
  const response = await apartmentApi.get("/pending");
  return response.data;
};

// Get all approved apartments for owner management
export const getApprovedApartments = async () => {
  const response = await apartmentApi.get("/approved");
  return response.data;
};

// Approve a new apartment
export const approveApartment = async (id) => {
  const response = await apartmentApi.patch(`/${id}/approve`);
  return response.data;
};

// Reject a new apartment
export const rejectApartment = async (id) => {
  const response = await apartmentApi.patch(`/${id}/reject`);
  return response.data;
};

// ==============================
// OWNER: APARTMENT EDIT APPROVALS
// ==============================

// Get pending manager edit requests
export const getPendingApartmentUpdates = async () => {
  const response = await apartmentApi.get("/pending-updates");
  return response.data;
};

// Approve a manager's proposed edits
export const approveApartmentUpdate = async (id) => {
  const response = await apartmentApi.patch(`/${id}/approve-update`);
  return response.data;
};

// Reject a manager's proposed edits
export const rejectApartmentUpdate = async (id) => {
  const response = await apartmentApi.patch(`/${id}/reject-update`);
  return response.data;
};

// ==============================
// OWNER: APARTMENT DELETION APPROVALS
// ==============================

// Get pending manager deletion requests
export const getPendingApartmentDeletions = async () => {
  const response = await apartmentApi.get("/pending-deletions");
  return response.data;
};

// Approve a manager's deletion request
export const approveApartmentDeletion = async (id) => {
  const response = await apartmentApi.patch(`/${id}/approve-deletion`);
  return response.data;
};

// Reject a manager's deletion request
export const rejectApartmentDeletion = async (id) => {
  const response = await apartmentApi.patch(`/${id}/reject-deletion`);
  return response.data;
};
