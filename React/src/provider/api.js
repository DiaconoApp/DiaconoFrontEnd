import axios from "axios";

let baseURL = "";
// if (import.meta.env.VITE_API_IP === undefined || import.meta.env.VITE_API_PORT === undefined) {
//   baseURL = "/api";
// } else {
//   baseURL = `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}`;
// }

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  // Evita /api/api/... quando baseURL ja inclui /api.
  if (baseURL === "/api" && typeof config.url === "string" && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default api;