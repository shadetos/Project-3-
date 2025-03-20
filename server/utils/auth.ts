// utils/auth.ts

import jwtDecode from "jwt-decode";

/**
 * Decode a JWT token and return the payload.
 * @param token JWT token string
 * @returns Decoded token payload or null
 */
export const decodeToken = (token: string): any | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
};

/**
 * Save token to localStorage
 * @param token JWT token string
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

/**
 * Retrieve token from localStorage
 * @returns JWT token string or null
 */
export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Remove token from localStorage (logout)
 */
export const removeToken = (): void => {
  localStorage.removeItem("authToken");
};
