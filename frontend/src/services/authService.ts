import axios from 'axios';
import type { User } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// withCredentials ensures the HttpOnly auth cookie is sent with every request
export const register = async (userData: { name: string; email: string; password: string }): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/register`, userData, { withCredentials: true });
    return response.data;
};

export const login = async (userData: { email: string; password: string }): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/login`, userData, { withCredentials: true });
    return response.data;
};
