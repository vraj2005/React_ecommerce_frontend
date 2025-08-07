import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if your backend URL differs
  headers: { "Content-Type": "application/json" },
});

// Add token to requests if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;