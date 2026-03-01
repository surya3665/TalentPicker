import type { Types } from 'mongoose';

export type JobType = 'full-time' | 'part-time' | 'remote' | 'internship';

export interface IJob {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: JobType;
  companyId: Types.ObjectId | string;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}