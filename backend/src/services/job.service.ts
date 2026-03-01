import { Job } from '../models/Job';
import type { IJobDocument } from '../models/Job';
import type { CreateJobDTO, UpdateJobDTO, JobQueryDTO } from '../types/job.dto';

interface PaginatedJobs {
  jobs: IJobDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class JobService {
  async createJob(companyId: string, dto: CreateJobDTO): Promise<IJobDocument> {
    const job = await Job.create({ ...dto, companyId });
    return job;
  }

  async getJobs(query: JobQueryDTO): Promise<PaginatedJobs> {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '10', 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter['$text'] = { $search: query.search };
    }

    if (query.location) {
      filter['location'] = { $regex: query.location, $options: 'i' };
    }

    if (query.type) {
      filter['type'] = query.type;
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('companyId', 'name companyName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getJobById(id: string): Promise<IJobDocument> {
    const job = await Job.findById(id).populate('companyId', 'name companyName email');
    if (!job) {
      throw Object.assign(new Error('Job not found'), { statusCode: 404 });
    }
    return job;
  }

  async updateJob(id: string, companyId: string, dto: UpdateJobDTO): Promise<IJobDocument> {
    const job = await Job.findOneAndUpdate(
      { _id: id, companyId },
      dto,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw Object.assign(new Error('Job not found or unauthorized'), { statusCode: 404 });
    }
    return job;
  }

  async deleteJob(id: string, companyId?: string): Promise<void> {
    const filter: Record<string, unknown> = { _id: id };
    if (companyId) filter['companyId'] = companyId;

    const job = await Job.findOneAndDelete(filter);
    if (!job) {
      throw Object.assign(new Error('Job not found or unauthorized'), { statusCode: 404 });
    }
  }

  async getCompanyJobs(companyId: string): Promise<IJobDocument[]> {
    return Job.find({ companyId }).sort({ createdAt: -1 });
  }
}

export const jobService = new JobService();