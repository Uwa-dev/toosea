import axios from "axios";

export const apartmentApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/apartment`,
});

apartmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createApartment = async (data) => {
  const response = await apartmentApi.post("/", data);
  return response.data;
};

export const uploadApartmentImages = async (id, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apartmentApi.post(`/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllApartments = async() => {
  const response = await apartmentApi.get('/');
  return response.data
}

export const singleApartment = async(id) => {
  const response = await apartmentApi.get(`/${id}`)
  return response.data
}

export const deleteApartmentImage = async (
  apartmentId,
  publicId
) => {
  const response = await apartmentApi.delete(
    `/${apartmentId}/images/${encodeURIComponent(publicId)}`
  );

  return response.data;
};

export const deleteApartment = async (id) => {
  const response = await apartmentApi.delete(
    `/${id}`
  );

  return response.data;
};