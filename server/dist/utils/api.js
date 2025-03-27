import axios from "axios";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// Attach JWT token dynamically before every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        else {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
});
// Generic GET request
export const getRequest = async (endpoint, params = {}) => {
    try {
        const response = await apiClient.get(endpoint, { params });
        return response.data;
    }
    catch (error) {
        console.error("GET request error:", error);
        throw error;
    }
};
// Generic POST request
export const postRequest = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    }
    catch (error) {
        console.error("POST request error:", error);
        throw error;
    }
};
// Generic PUT request
export const putRequest = async (endpoint, data) => {
    try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
    }
    catch (error) {
        console.error("PUT request error:", error);
        throw error;
    }
};
// Generic DELETE request
export const deleteRequest = async (endpoint) => {
    try {
        const response = await apiClient.delete(endpoint);
        return response.data;
    }
    catch (error) {
        console.error("DELETE request error:", error);
        throw error;
    }
};
export default apiClient;
