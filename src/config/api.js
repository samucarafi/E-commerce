import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,

  withCredentials: true, // Importante para enviar cookies automaticamente
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor para enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
