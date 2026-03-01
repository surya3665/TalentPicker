export type UserRole = 'admin' | 'company' | 'candidate';
export type JobType = 'full-time' | 'part-time' | 'remote' | 'internship';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  resume?: string;
  companyName?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: JobType;
  companyId: User | string;
  applicantsCount: number;
  createdAt: string;
}

export interface Application {
  _id: string;
  candidateId: User | string;
  jobId: Job | string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  location: string;
  salary: string;
  type: JobType;
}

export interface JobFilters {
  search: string;
  location: string;
  type: string;
  page: number;
}