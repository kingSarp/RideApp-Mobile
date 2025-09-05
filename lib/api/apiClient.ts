// src/api/client.ts
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_BASE_URL="http://172.20.10.9:5001"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
