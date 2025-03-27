import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

// Create auth context
const AuthContext = createContext(null);

/**
 * AuthProvider component to manage authentication state
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Load user from localStorage if available
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error initializing auth state:", error);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      setCurrentUser(response.user || null);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Login an existing user
   * @param {Object} credentials - User login credentials
   */
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user || null);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  /**
   * Check if the user is authenticated
   */
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
