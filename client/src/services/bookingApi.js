import axios from 'axios';

export const bookingApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/booking`
})

bookingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createOnlineBooking = async (data) => {
  const response = await bookingApi.post(
    "/online",
    data
  );

  return response.data;
};

export const createWalkInBooking = async (data) => {
  const response = await bookingApi.post("/walkin", data);

  return response.data;
};

export const getTodayBookings = async () => {
  const response = await bookingApi.get("/today");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await bookingApi.get(`/${id}`);
  return response.data.booking;
};

export const checkInGuest = async (id) => {
  const response = await bookingApi.patch(`/${id}/checkin`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await bookingApi.patch(`/${id}/cancel`);
  return response.data;
};

export const getCheckedInGuests = async () => {
  const response = await bookingApi.get("/checkedin");
  return response.data;
};

export const transferAndExtendStay = async (id, data) => {
  const response = await bookingApi.patch(`/${id}/transfer`, data);
  return response.data;
};

export const checkOutGuest = async (id) => {
  const response = await bookingApi.patch(`/${id}/checkout`);
  return response.data;
};

export const getMonthlyBookings = async (
  year,
  month
) => {
  const response = await bookingApi.get(
    `/monthly?year=${year}&month=${month}`
  );

  return response.data;
};

export const getYearlyBookings = async (
  year
) => {
  const response = await bookingApi.get(
    `/yearly?year=${year}`
  );

  return response.data;
};