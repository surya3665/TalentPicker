import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationService } from '../services/application.service';
import Toast from '../components/common/Toast';
import type { Application, ApplicationStatus } from '../types';

const STATUS_OPTIONS: ApplicationStatus[] = ['applied', 'shortlisted', 'rejected'];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const ApplicantsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (!jobId) return;
    applicationService.getJobApplicants(jobId)
      .then((res) => setApplications(res.data ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusUpdate = async (appId: string, status: ApplicationStatus) => {
    try {
      await applicationService.updateStatus(appId, status);
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
      setToast({ message: 'Status updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Applicants</h1>
        <p className="text-text-secondary mb-6">{applications.length} candidates applied</p>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-border p-12 text-center">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="font-display font-semibold text-text-primary">No applicants yet</h3>
            <p className="text-text-secondary text-sm mt-2">Share your job post to attract candidates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const candidate = typeof app.candidateId === 'object' ? app.candidateId : null;

              return (
                <div key={app._id} className="bg-white rounded-2xl border border-neutral-border p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                        <span className="text-primary font-display font-bold">
                          {(candidate?.name ?? 'C').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{candidate?.name ?? 'Candidate'}</p>
                        <p className="text-sm text-text-secondary">{candidate?.email}</p>
                        {candidate?.resume && (
                          <a
                            href={`/uploads/resumes/${candidate.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            📄 View Resume
                          </a>
                        )}
                        <p className="text-xs text-text-muted mt-1">
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) => { void handleStatusUpdate(app._id, e.target.value as ApplicationStatus); }}
                        className="text-sm border border-neutral-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </div>
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

export default ApplicantsPage;