import axios from "axios";

export const publicApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

export const getApartmentBookedDates = async (id) => {
  const response = await publicApi.get(
    `booking/${id}/booked-dates`
  );

  return response.data;
};

export const getAvailableApartments = async (
  checkInDate,
  checkOutDate
) => {
  const response = await bookingApi.get(
    "booking/available-apartments",
    {
      params: {
        checkInDate,
        checkOutDate,
      },
    }
  );

  return response.data;
};
