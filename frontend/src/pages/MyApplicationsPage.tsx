import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/application.service';
import type { Application } from '../types';

const STATUS_CONFIG = {
  applied: { label: 'Applied', bg: 'bg-blue-100 text-blue-700', icon: '📝' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-green-100 text-green-700', icon: '🌟' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700', icon: '❌' },
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getMyApplications()
      .then((res) => setApplications(res.data ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">My Applications</h1>
          <p className="text-text-secondary mt-1">{applications.length} applications submitted</p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div key={status} className="bg-white rounded-xl border border-neutral-border p-4 text-center">
              <span className="text-2xl">{config.icon}</span>
              <p className="font-display font-bold text-xl text-text-primary mt-1">
                {applications.filter((a) => a.status === status).length}
              </p>
              <p className="text-xs text-text-muted">{config.label}</p>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-border p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display font-semibold text-text-primary mb-2">No applications yet</h3>
            <p className="text-text-secondary text-sm mb-4">Start applying to jobs that match your skills</p>
            <Link to="/jobs" className="inline-block px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const job = typeof app.jobId === 'object' ? app.jobId : null;
              const company = job && typeof job.companyId === 'object' ? job.companyId : null;
              const config = STATUS_CONFIG[app.status];

              return (
                <div key={app._id} className="bg-white rounded-2xl border border-neutral-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-display font-bold">
                          {(company?.companyName ?? company?.name ?? 'C').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Link to={`/jobs/${job?._id}`} className="font-display font-semibold text-text-primary hover:text-primary">
                          {job?.title ?? 'Job'}
                        </Link>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {company?.companyName ?? company?.name ?? 'Company'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-text-muted">
                          {job && (
                            <>
                              <span>📍 {job.location}</span>
                              <span>💰 {job.salary}</span>
                            </>
                          )}
                          <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${config.bg}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;