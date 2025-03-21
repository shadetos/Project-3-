import { jwtDecode } from "jwt-decode";

/**
 * Type definition for decoded JWT payload
 */
interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}

/**
 * Decode a JWT token and return the payload.
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
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

/**
 * Check if JWT token is expired
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded) return true;

  return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
};
