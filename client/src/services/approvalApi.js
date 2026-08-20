import axios from "axios";
import { logout } from "../utils/slices/userSlice.js";
import store from '../utils/store.js'

export const approvalApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

approvalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

approvalApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const getPendingUsers = async () => {
  const response = await approvalApi.get("/users/pending");
  return response.data;
};

export const approveUser = async (id) => {
  const response = await approvalApi.put(`/users/${id}/approve`);
  return response.data;
};

export const rejectUser = async (id) => {
  const response = await approvalApi.put(`/users/${id}/reject`);
  return response.data;
};

export const getPendingApartments = async () => {
  const response = await approvalApi.get("/apartment/pending");
  return response.data;
};

export const approveApartment = async (id) => {
  const response = await approvalApi.patch(`/apartment/${id}/approve`);
  return response.data;
};

export const rejectApartment = async (id) => {
  const response = await approvalApi.patch(`/apartment/${id}/reject`);
  return response.data;
};

export const getApprovedUsers = async () => {
  const response = await approvalApi.get("/users/approved");
  return response.data;
};

export const getApprovedApartments = async () => {
  const response = await approvalApi.get("/apartment/approved");
  return response.data;
};