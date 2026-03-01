import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/job.service';
import Toast from '../components/common/Toast';
import type { CreateJobDTO, JobType } from '../types';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateJobDTO>({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'full-time',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createJob(form);
      setToast({ message: 'Job posted successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setToast({ message: axiosError.response?.data?.message ?? 'Failed to post job', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">Post a Job</h1>
          <p className="text-text-secondary mt-1">Find the perfect candidate for your team</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-border p-6 md:p-8">
          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Job Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="e.g. Senior React Developer"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Salary *</label>
                <input
                  type="text"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. $80k - $100k"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Job Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['full-time', 'part-time', 'remote', 'internship'] as JobType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, type })}
                    className={`py-2.5 text-sm font-medium rounded-xl border capitalize transition-colors ${
                      form.type === type
                        ? 'bg-primary text-white border-primary'
                        : 'border-neutral-border hover:border-primary/50 text-text-secondary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Job Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-neutral-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Describe the role, responsibilities, requirements..."
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border border-neutral-border rounded-xl text-sm font-medium text-text-secondary hover:bg-neutral-bg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;