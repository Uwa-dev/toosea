import axios from "axios";
import { logout } from "../util/slices/userSlice";
import store from '../util/store'

export const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/user`
})

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Use persisted token
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