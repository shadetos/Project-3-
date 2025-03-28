import axios from "axios";

// Set base URL for all requests
// For Create React App, use import.meta.env for Vite or window._env_ for custom solutions
// If you're using Create React App (CRA):
const API_URL =
  import.meta.env?.VITE_API_URL ||
  (window.env && window.env.REACT_APP_API_URL) ||
  "http://localhost:5000";

// Set base URL for all requests
axios.defaults.baseURL = API_URL;

// Add a request interceptor to add JWT token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is due to an expired JWT token
    if (error.response && error.response.status === 401) {
      // Clear the token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
