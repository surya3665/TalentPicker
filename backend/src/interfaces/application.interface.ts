import type { Types } from 'mongoose';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected';

export interface IApplication {
  _id: string;
  candidateId: Types.ObjectId | string;
  jobId: Types.ObjectId | string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}