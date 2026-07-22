import axios from 'axios';

export const bookingApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/booking`
})

export const createOnlineBooking = async (data) => {
  const response = await bookingApi.post(
    "/online",
    data
  );

  return response.data;
};