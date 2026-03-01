import { User } from '../models/User';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import type { IUserDocument } from '../models/User';
import type { IJobDocument } from '../models/Job';

export class AdminService {

  async getAllUsers(): Promise<IUserDocument[]> {
    return User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    await Job.deleteMany({ companyId: userId });
    await Application.deleteMany({ candidateId: userId });
  }

  async approveCompany(userId: string): Promise<IUserDocument> {
    const user = await User.findOneAndUpdate(
      { _id: userId, role: 'company' },
      { isApproved: true },
      { new: true, select: '-password' }
    );
    if (!user) {
      throw Object.assign(new Error('Company not found'), { statusCode: 404 });
    }
    return user;
  }

  async getAllJobs(): Promise<IJobDocument[]> {
    return Job.find()
      .populate('companyId', 'name companyName email')
      .sort({ createdAt: -1 });
  }

  async deleteJob(jobId: string): Promise<void> {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      throw Object.assign(new Error('Job not found'), { statusCode: 404 });
    }
    await Application.deleteMany({ jobId });
  }

  async getStats(): Promise<Record<string, number>> {
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingCompanies,
    ] = await Promise.all([
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'company' }),
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: 'company', isApproved: false }),
    ]);

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingCompanies,
    };
  }
}

export const adminService = new AdminService();