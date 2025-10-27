import axios from "axios";

let baseURL;
if (import.meta.env.VITE_API_IP === undefined || import.meta.env.VITE_API_PORT === undefined) {
  baseURL = "/api";
} else {
  baseURL = `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}`;
}

const api = axios.create({ baseURL });


// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
