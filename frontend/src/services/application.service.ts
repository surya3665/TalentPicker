import axiosInstance from './axios';
import type { ApiResponse, Application, ApplicationStatus } from '../types';

export const applicationService = {
  apply: async (jobId: string): Promise<ApiResponse<Application>> => {
    const res = await axiosInstance.post<ApiResponse<Application>>(`/applications/${jobId}`);
    return res.data;
  },

  getMyApplications: async (): Promise<ApiResponse<Application[]>> => {
    const res = await axiosInstance.get<ApiResponse<Application[]>>('/applications/my-applications');
    return res.data;
  },

  getJobApplicants: async (jobId: string): Promise<ApiResponse<Application[]>> => {
    const res = await axiosInstance.get<ApiResponse<Application[]>>(`/applications/job/${jobId}`);
    return res.data;
  },

  updateStatus: async (id: string, status: ApplicationStatus): Promise<ApiResponse<Application>> => {
    const res = await axiosInstance.put<ApiResponse<Application>>(`/applications/${id}/status`, { status });
    return res.data;
  },
};