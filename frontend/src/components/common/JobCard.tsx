import { Link } from 'react-router-dom';
import type { Job } from '../../types';

const JOB_TYPE_COLORS: Record<string, string> = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  remote: 'bg-green-100 text-green-700',
  internship: 'bg-yellow-100 text-yellow-700',
};

interface JobCardProps {
  job: Job;
  onApply?: (id: string) => void;
  showApplyButton?: boolean;
  isApplied?: boolean;
}

const JobCard = ({ job, onApply, showApplyButton = true, isApplied = false }: JobCardProps) => {
  const company = typeof job.companyId === 'object' ? job.companyId : null;

  return (
    <div className="bg-white rounded-xl border border-neutral-border p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company Avatar */}
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-display font-bold text-lg">
              {(company?.companyName ?? company?.name ?? 'C').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <Link to={`/jobs/${job._id}`}>
              <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
            </Link>
            <p className="text-sm text-text-secondary mt-0.5">
              {company?.companyName ?? company?.name ?? 'Company'}
            </p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${JOB_TYPE_COLORS[job.type] ?? 'bg-gray-100 text-gray-700'}`}>
          {job.type}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.salary}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.applicantsCount} applicants
        </span>
      </div>

      {showApplyButton && (
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 text-center py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary-light transition-colors"
          >
            View Details
          </Link>
          {onApply && (
            <button
              onClick={() => onApply(job._id)}
              disabled={isApplied}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isApplied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {isApplied ? '✓ Applied' : 'Apply Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;