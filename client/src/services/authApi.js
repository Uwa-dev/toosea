import axios from "axios";
import { logout } from "../utils/slices/userSlice.js";
import store from '../utils/store.js'

export const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/users`
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
  const response = await authApi.post("/login", {
    email,
    password,
  });

  return response.data;
};

export const createUser = async (userData) => {
    const response = await authApi.post("/register", userData);
    return response.data;
};

export const allstaffs = async () => {
  const response = await authApi.get("/staffs");
  return response.data
}

export const singleStaff = async (id) => {
  const response = await authApi.get(`/staff/${id}`);
  return response.data
}