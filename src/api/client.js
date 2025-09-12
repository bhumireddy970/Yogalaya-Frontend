// src/api/client.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
});

// ✅ attach token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ optional: handle 401 (expired token) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // clear invalid token
      // we could also dispatch logout() here if store is available
    }
    return Promise.reject(error);
  }
);

export default api;
