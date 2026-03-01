import mongoose, { Schema, type Document } from 'mongoose';
import type { IJob, JobType } from '../interfaces/job.interface';

export interface IJobDocument extends Omit<IJob, '_id'>, Document {}

const JobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'] as JobType[],
      default: 'full-time',
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
JobSchema.index({ title: 'text', location: 'text', description: 'text' });

export const Job = mongoose.model<IJobDocument>('Job', JobSchema);