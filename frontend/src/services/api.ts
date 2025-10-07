import axios from 'axios';
import { HostingSlot, CreateHostingSlotRequest, LoginRequest, LoginResponse, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');

console.log('API_BASE_URL:', API_BASE_URL);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { password });
      if (response.data.success && response.data.data) {
        localStorage.setItem('authToken', response.data.data.token);
        return response.data.data;
      }
      throw new Error(response.data.error || 'Login failed');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Incorrect password');
      }
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  }
};

export const hostingSlotsService = {
  getAllSlots: async (): Promise<HostingSlot[]> => {
    const response = await api.get<ApiResponse<HostingSlot[]>>('/hosting-slots');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch hosting slots');
  },

  createSlot: async (slotData: CreateHostingSlotRequest): Promise<void> => {
    const response = await api.post<ApiResponse>('/hosting-slots', slotData);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create hosting slot');
    }
  },

  deleteSlot: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/hosting-slots/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete hosting slot');
    }
  }
};
