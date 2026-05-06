import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "axiora.token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 6. Console logging for debugging
    console.error("=== API Error ===");
    console.error("Request URL:", error.config?.url);
    console.error("Response status:", error.response?.status);
    console.error("Backend error message:", error.response?.data);
    console.error("Axios error details:", error.message);

    const status = error?.response?.status;
    if (status === 401) {
      clearToken();
    }

    // 5. Proper error handling
    let message = "Something went wrong";

    if (error.response) {
      // Server responded with a status other than 200 range
      if (status === 401 || status === 403) {
        message = "Invalid credentials or unauthorized";
      } else if (status === 404) {
        message = "API not found";
      } else if (status === 422 || status === 400) {
        message = error.response.data?.message || error.response.data?.error?.message || "Validation errors";
      } else if (status >= 500) {
        message = "Server unavailable";
      } else {
        message = error.response.data?.message || error.response.data?.error?.message || `Error ${status}`;
      }
    } else if (error.request) {
      // Request was made but no response received (Network Error)
      message = "Backend connection failed. Please check if the server is running.";
    } else {
      // Something happened in setting up the request
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
