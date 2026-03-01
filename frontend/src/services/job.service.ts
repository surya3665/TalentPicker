import axiosInstance from './axios';
import type { ApiResponse, Job, CreateJobDTO, JobFilters } from '../types';

export const jobService = {
  getJobs: async (filters: Partial<JobFilters>): Promise<ApiResponse<Job[]>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', String(filters.page));
    params.append('limit', '10');

    const res = await axiosInstance.get<ApiResponse<Job[]>>(`/jobs?${params.toString()}`);
    return res.data;
  },

  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const res = await axiosInstance.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data;
  },

  createJob: async (data: CreateJobDTO): Promise<ApiResponse<Job>> => {
    const res = await axiosInstance.post<ApiResponse<Job>>('/jobs', data);
    return res.data;
  },

  updateJob: async (id: string, data: Partial<CreateJobDTO>): Promise<ApiResponse<Job>> => {
    const res = await axiosInstance.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return res.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/jobs/${id}`);
    return res.data;
  },

  getMyJobs: async (): Promise<ApiResponse<Job[]>> => {
    const res = await axiosInstance.get<ApiResponse<Job[]>>('/jobs/company/my-jobs');
    return res.data;
  },
};