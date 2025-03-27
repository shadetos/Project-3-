/**
 * Authentication service for handling user login, registration, and token management
 */

// API endpoints
const API_URL = "/api/auth";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Response data from the server
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  // If token is returned, store it
  if (data.token || data.access_token) {
    const token = data.token || data.access_token;
    localStorage.setItem("token", token);

    // Store user info if available
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  return data;
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response data from the server
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store token
  const token = data.token || data.access_token;
  localStorage.setItem("token", token);

  // Store user info if available
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get the current user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Get the authentication token
 * @returns {string|null} Token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

// Export auth service
const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
};

export default authService;
