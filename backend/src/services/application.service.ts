import { Application } from '../models/Application';
import { Job } from '../models/Job';
import type { IApplicationDocument } from '../models/Application';
import type { ApplicationStatus } from '../interfaces/application.interface';

export class ApplicationService {
  async apply(candidateId: string, jobId: string): Promise<IApplicationDocument> {
    const job = await Job.findById(jobId);
    if (!job) {
      throw Object.assign(new Error('Job not found'), { statusCode: 404 });
    }

    const existing = await Application.findOne({ candidateId, jobId });
    if (existing) {
      throw Object.assign(new Error('You have already applied for this job'), { statusCode: 400 });
    }

    const application = await Application.create({ candidateId, jobId });

    // Increment applicants count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    return application;
  }

  async getMyApplications(candidateId: string): Promise<IApplicationDocument[]> {
    return Application.find({ candidateId })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name companyName' },
      })
      .sort({ createdAt: -1 });
  }

  async getJobApplicants(jobId: string, companyId: string): Promise<IApplicationDocument[]> {
    const job = await Job.findOne({ _id: jobId, companyId });
    if (!job) {
      throw Object.assign(new Error('Job not found or unauthorized'), { statusCode: 404 });
    }

    return Application.find({ jobId })
      .populate('candidateId', 'name email resume')
      .sort({ createdAt: -1 });
  }

  async updateStatus(
    applicationId: string,
    companyId: string,
    status: ApplicationStatus
  ): Promise<IApplicationDocument> {
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      throw Object.assign(new Error('Application not found'), { statusCode: 404 });
    }

    const job = await Job.findOne({ _id: application.jobId, companyId });
    if (!job) {
      throw Object.assign(new Error('Unauthorized to update this application'), { statusCode: 403 });
    }

    application.status = status;
    await application.save();
    return application;
  }
}

export const applicationService = new ApplicationService();