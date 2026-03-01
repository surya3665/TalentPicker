import type { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateJobDTO, UpdateJobDTO, JobQueryDTO } from '../types/job.dto';

export class JobController {
  async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const dto = req.body as CreateJobDTO;
      const job = await jobService.createJob(companyId, dto);
      sendSuccess(res, 'Job created successfully', job, 201);
    } catch (error) {
      next(error);
    }
  }

  async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as JobQueryDTO;
      const result = await jobService.getJobs(query);
      sendSuccess(res, 'Jobs retrieved', result.jobs, 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await jobService.getJobById(req.params['id'] as string);
      sendSuccess(res, 'Job retrieved', job);
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const dto = req.body as UpdateJobDTO;
      const job = await jobService.updateJob(req.params['id'] as string, companyId, dto);
      sendSuccess(res, 'Job updated successfully', job);
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      await jobService.deleteJob(req.params['id'] as string, companyId);
      sendSuccess(res, 'Job deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const jobs = await jobService.getCompanyJobs(companyId);
      sendSuccess(res, 'Company jobs retrieved', jobs);
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();