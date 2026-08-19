import axios from "axios";

const analyticsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/analytics`,
});

analyticsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getReceptionistDashboard = async () => {
  const response = await analyticsApi.get("/receptionist");

  return response.data;
};