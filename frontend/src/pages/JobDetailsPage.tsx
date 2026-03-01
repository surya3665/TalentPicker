import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import Toast from '../components/common/Toast';
import type { Job } from '../types';

const JOB_TYPE_COLORS: Record<string, string> = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  remote: 'bg-green-100 text-green-700',
  internship: 'bg-yellow-100 text-yellow-700',
};

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (!id) return;
    jobService.getJobById(id).then((res) => {
      setJob(res.data ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await applicationService.apply(id!);
      setApplied(true);
      setJob((prev) => prev ? { ...prev, applicantsCount: prev.applicantsCount + 1 } : prev);
      setToast({ message: 'Applied successfully!', type: 'success' });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setToast({ message: axiosError.response?.data?.message ?? 'Failed to apply', type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="font-display font-semibold text-xl text-text-primary">Job not found</h3>
          <button onClick={() => navigate('/jobs')} className="mt-4 text-primary hover:underline">Back to Jobs</button>
        </div>
      </div>
    );
  }

  const company = typeof job.companyId === 'object' ? job.companyId : null;

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 text-sm">
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-2xl border border-neutral-border p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-display font-bold text-2xl">
                  {(company?.companyName ?? company?.name ?? 'C').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">{job.title}</h1>
                <p className="text-text-secondary mt-1">{company?.companyName ?? company?.name ?? 'Company'}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${JOB_TYPE_COLORS[job.type] ?? 'bg-gray-100 text-gray-700'}`}>
                    {job.type}
                  </span>
                </div>
              </div>
            </div>

            {user?.role === 'candidate' && (
              <button
                onClick={() => { void handleApply(); }}
                disabled={applying || applied}
                className={`px-8 py-3 font-semibold rounded-xl transition-colors flex-shrink-0 ${
                  applied
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {applying ? 'Applying...' : applied ? '✓ Applied' : 'Apply Now'}
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-border">
            {[
              { label: 'Location', value: job.location, icon: '📍' },
              { label: 'Salary', value: job.salary, icon: '💰' },
              { label: 'Type', value: job.type, icon: '💼' },
              { label: 'Applicants', value: `${job.applicantsCount} applied`, icon: '👥' },
            ].map((item) => (
              <div key={item.label} className="bg-neutral-bg rounded-xl p-4">
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs text-text-muted mt-1">{item.label}</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5 capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-neutral-border p-6 md:p-8">
          <h2 className="font-display font-bold text-xl text-text-primary mb-4">Job Description</h2>
          <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;