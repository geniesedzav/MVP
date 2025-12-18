import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE;

console.log("🎯 Текущее окружение:", import.meta.env.VITE_APP_ENV);
console.log("🔗 API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// ✅ ИНТЕРЦЕПТОР ДЛЯ АВТОМАТИЧЕСКОЙ ПОДСТАНОВКИ ТОКЕНА
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

// ✅ ИНТЕРЦЕПТОР ДЛЯ ОБРАБОТКИ ОШИБОК
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
