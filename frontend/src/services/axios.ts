import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://talentpicker.onrender.com/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor — only auto-logout on 401 for protected API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/profile');

    // Only force logout if:
    // 1. Response is 401
    // 2. Not an auth route (login/register/profile)
    // 3. User had a token (i.e., their session expired mid-use)
    const token = localStorage.getItem('token');
    if (error.response?.status === 401 && !isAuthRoute && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Always reject — let the calling code handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;