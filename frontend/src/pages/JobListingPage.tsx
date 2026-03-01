import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import JobCard from '../components/common/JobCard';
import Toast from '../components/common/Toast';
import type { Job, JobFilters, JobType } from '../types';

const JobListingPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    type: '',
    page: 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs(filters);
      setJobs(res.data ?? []);
      if (res.pagination) {
        setPagination({ total: res.pagination.total, totalPages: res.pagination.totalPages });
      }
    } catch {
      setToast({ message: 'Failed to load jobs', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === 'candidate') {
      applicationService.getMyApplications().then((res) => {
        const ids = new Set((res.data ?? []).map((a) => {
          const job = typeof a.jobId === 'object' ? a.jobId : null;
          return job ? job._id : (a.jobId as string);
        }));
        setAppliedJobs(ids);
      }).catch(() => null);
    }
  }, [user]);

  const handleApply = async (jobId: string) => {
    try {
      await applicationService.apply(jobId);
      setAppliedJobs((prev) => new Set([...prev, jobId]));
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
      setToast({ message: 'Application submitted successfully!', type: 'success' });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setToast({ message: axiosError.response?.data?.message ?? 'Failed to apply', type: 'error' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero Search */}
      <div className="hero-gradient border-b border-neutral-border py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-2">
            Find Your <span className="text-primary">Dream Job</span>
          </h1>
          <p className="text-text-secondary mb-6">
            Discover {pagination.total}+ opportunities from top companies
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-neutral-border shadow-sm p-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Job title, keyword..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-4 py-3 text-sm focus:outline-none rounded-xl"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="flex-1 px-4 py-3 text-sm focus:outline-none border-t sm:border-t-0 sm:border-l border-neutral-border rounded-xl"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-text-secondary">Filter:</span>
          {(['', 'full-time', 'part-time', 'remote', 'internship'] as (JobType | '')[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, type, page: 1 })}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                filters.type === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-neutral-border hover:border-primary/50'
              }`}
            >
              {type === '' ? 'All Jobs' : type}
            </button>
          ))}
          <span className="ml-auto text-sm text-text-muted">
            {pagination.total} jobs found
          </span>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-border p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-neutral-bg rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-bg rounded w-3/4 mb-2" />
                    <div className="h-3 bg-neutral-bg rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-neutral-bg rounded w-full mb-2" />
                <div className="h-3 bg-neutral-bg rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-text-primary mb-2">No jobs found</h3>
            <p className="text-text-secondary">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={user?.role === 'candidate' ? handleApply : undefined}
                isApplied={appliedJobs.has(job._id)}
                showApplyButton={true}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 text-sm font-medium border border-neutral-border rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setFilters({ ...filters, page: p })}
                className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                  filters.page === p ? 'bg-primary text-white' : 'border border-neutral-border hover:bg-white'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium border border-neutral-border rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingPage;