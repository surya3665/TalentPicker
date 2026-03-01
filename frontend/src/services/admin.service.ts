import axiosInstance from './axios';
import type { ApiResponse, User, Job } from '../types';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  pendingCompanies: number;
}

export const adminService = {
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const res = await axiosInstance.get<ApiResponse<AdminStats>>('/admin/stats');
    return res.data;
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const res = await axiosInstance.get<ApiResponse<User[]>>('/admin/users');
    return res.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/admin/users/${id}`);
    return res.data;
  },

  approveCompany: async (id: string): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.put<ApiResponse<User>>(`/admin/companies/${id}/approve`);
    return res.data;
  },

  getAllJobs: async (): Promise<ApiResponse<Job[]>> => {
    const res = await axiosInstance.get<ApiResponse<Job[]>>('/admin/jobs');
    return res.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/admin/jobs/${id}`);
    return res.data;
  },
};