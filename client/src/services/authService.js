// TODO: Handles login, logout, registration requests, and storage of auth tokens (JWT).
const API_URL = 'https://api.example.com/auth';
const TOKEN_KEY = 'authToken';

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const register = async (userInfo) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to register');
        }
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};