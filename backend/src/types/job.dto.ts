import type { JobType } from '../interfaces/job.interface';

export interface CreateJobDTO {
  title: string;
  description: string;
  location: string;
  salary: string;
  type: JobType;
}

export interface UpdateJobDTO {
  title?: string;
  description?: string;
  location?: string;
  salary?: string;
  type?: JobType;
}

export interface JobQueryDTO {
  search?: string;
  location?: string;
  type?: JobType;
  page?: string;
  limit?: string;
}