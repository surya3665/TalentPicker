import type { Request, Response, NextFunction } from 'express';
import { applicationService } from '../services/application.service';
import { sendSuccess } from '../utils/apiResponse';
import type { ApplicationStatus } from '../interfaces/application.interface';

export class ApplicationController {
  async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = req.user!.userId;
      const jobId = req.params['jobId'] as string;
      const application = await applicationService.apply(candidateId, jobId);
      sendSuccess(res, 'Applied successfully', application, 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = req.user!.userId;
      const applications = await applicationService.getMyApplications(candidateId);
      sendSuccess(res, 'Applications retrieved', applications);
    } catch (error) {
      next(error);
    }
  }

  async getJobApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const jobId = req.params['jobId'] as string;
      const applicants = await applicationService.getJobApplicants(jobId, companyId);
      sendSuccess(res, 'Applicants retrieved', applicants);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const applicationId = req.params['id'] as string;
      const { status } = req.body as { status: ApplicationStatus };
      const application = await applicationService.updateStatus(applicationId, companyId, status);
      sendSuccess(res, 'Application status updated', application);
    } catch (error) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();