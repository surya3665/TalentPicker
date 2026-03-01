import axiosInstance from './axios';
import type { ApiResponse, User, RegisterDTO, LoginDTO } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  register: async (data: RegisterDTO): Promise<ApiResponse<AuthResponse>> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginDTO): Promise<ApiResponse<AuthResponse>> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.get<ApiResponse<User>>('/auth/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.put<ApiResponse<User>>('/auth/profile', data);
    return res.data;
  },

  uploadResume: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await axiosInstance.post<ApiResponse<User>>('/auth/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};