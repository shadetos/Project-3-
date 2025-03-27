import apiClient from '../utils/apiClient';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw error;
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else {
      throw error;
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

export default { login, register, logout, getCurrentUser };
