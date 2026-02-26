import axios from 'axios';
import type { User } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const register = async (userData: any): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
};

export const login = async (userData: any): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
};
