import type { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';

export class AdminController {

  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      sendSuccess(res, 'Users retrieved', users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.deleteUser(req.params['id'] as string);
      sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async approveCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await adminService.approveCompany(req.params['id'] as string);
      sendSuccess(res, 'Company approved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await adminService.getAllJobs();
      sendSuccess(res, 'All jobs retrieved', jobs);
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.deleteJob(req.params['id'] as string);
      sendSuccess(res, 'Job deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getStats();
      sendSuccess(res, 'Stats retrieved', stats);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();