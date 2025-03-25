import { jwtDecode } from "jwt-decode";
/**
 * Decode a JWT token and return the payload.
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    }
    catch (error) {
        console.error("Invalid JWT token:", error);
        return null;
    }
};
/**
 * Save token to localStorage
 * @param token JWT token string
 */
export const saveToken = (token) => {
    localStorage.setItem("authToken", token);
};
/**
 * Retrieve token from localStorage
 * @returns JWT token string or null
 */
export const getToken = () => {
    return localStorage.getItem("authToken");
};
/**
 * Remove token from localStorage (logout)
 */
export const removeToken = () => {
    localStorage.removeItem("authToken");
};
/**
 * Check if JWT token is expired
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = () => {
    const token = getToken();
    if (!token)
        return true;
    const decoded = decodeToken(token);
    if (!decoded)
        return true;
    return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
};
