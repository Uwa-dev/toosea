import axios from 'axios';

export const paymentApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/payments`
})

export const initializePayment = async (data) => {
  const response = await paymentApi.post("/initialize", data);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await paymentApi.get(`/verify/${reference}`);
  return response.data;
};