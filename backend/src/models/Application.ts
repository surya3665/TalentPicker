import mongoose, { Schema, type Document } from 'mongoose';
import type { IApplication, ApplicationStatus } from '../interfaces/application.interface';

export interface IApplicationDocument extends Omit<IApplication, '_id'>, Document {}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected'] as ApplicationStatus[],
      default: 'applied',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);