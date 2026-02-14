import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  timeout: 10000,
  withCredentials: true, // Importante para enviar cookies automaticamente
  headers: {
    "Content-Type": "application/json",
  },
});
