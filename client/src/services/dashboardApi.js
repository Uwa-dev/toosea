import axios from "axios";

const dashboardApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/dashboard`,
});

dashboardApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getDashboardStats = async () => {
  const response = await dashboardApi.get("/adminDashboard");
  return response.data;
};

export const getOwnerDashboardStats = async () => {
  const response = await dashboardApi.get("/owner");

  return response.data;
};