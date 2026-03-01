import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import Toast from '../components/common/Toast';
import type { Job, Application } from '../types';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!user) return null;

  if (user.role === 'candidate') return <CandidateDashboard user={user} updateUser={updateUser} setToast={setToast} toast={toast} />;
  if (user.role === 'company') return <CompanyDashboard user={user} setToast={setToast} toast={toast} />;
  return <div className="p-8 text-center"><Link to="/admin" className="text-primary underline">Go to Admin Panel</Link></div>;
};

const CandidateDashboard = ({ user, updateUser, setToast, toast }: {
  user: ReturnType<typeof useAuth>['user'];
  updateUser: ReturnType<typeof useAuth>['updateUser'];
  setToast: (t: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}) => {
  const [uploading, setUploading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');

  useEffect(() => {
    applicationService.getMyApplications().then((r) => setApplications(r.data ?? [])).catch(() => null);
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authService.uploadResume(file);
      if (res.data && user) updateUser({ ...user, resume: res.data.resume });
      setToast({ message: 'Resume uploaded!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to upload resume', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      const res = await authService.updateProfile({ name });
      if (res.data && user) updateUser({ ...user, name: res.data.name });
      setEditing(false);
      setToast({ message: 'Profile updated!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const STATUS_COLORS = { applied: 'bg-blue-100 text-blue-700', shortlisted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-neutral-border p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-text-primary">My Profile</h2>
            <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline">
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center">
              <span className="text-primary font-display font-bold text-2xl">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-3 py-2 border border-neutral-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={() => { void handleUpdateName(); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark">Save</button>
                </div>
              ) : (
                <p className="font-semibold text-text-primary">{user?.name}</p>
              )}
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mt-6 pt-6 border-t border-neutral-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary text-sm">Resume</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {user?.resume ? `📄 ${user.resume}` : 'No resume uploaded'}
                </p>
              </div>
              <label className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${uploading ? 'bg-neutral-bg text-text-muted cursor-not-allowed' : 'bg-primary-light text-primary hover:bg-primary/10'}`}>
                {uploading ? 'Uploading...' : 'Upload PDF'}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => { void handleResumeUpload(e); }} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-neutral-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-text-primary">My Applications</h2>
            <Link to="/my-applications" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">No applications yet</p>
              <Link to="/jobs" className="mt-2 inline-block text-primary text-sm hover:underline">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => {
                const job = typeof app.jobId === 'object' ? app.jobId : null;
                return (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-neutral-bg rounded-xl">
                    <div>
                      <p className="font-medium text-sm text-text-primary">{job?.title ?? 'Job'}</p>
                      <p className="text-xs text-text-muted">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CompanyDashboard = ({ user, setToast, toast }: {
  user: ReturnType<typeof useAuth>['user'];
  setToast: (t: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobService.getMyJobs().then((r) => setJobs(r.data ?? [])).catch(() => null);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setToast({ message: 'Job deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete job', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">{user?.companyName ?? user?.name}</h1>
            <p className="text-text-secondary text-sm">Company Dashboard</p>
          </div>
          <Link to="/post-job" className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm">
            + Post Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Jobs', value: jobs.length, icon: '💼' },
            { label: 'Total Applicants', value: jobs.reduce((s, j) => s + j.applicantsCount, 0), icon: '👥' },
            { label: 'Status', value: user?.isApproved ? 'Approved' : 'Pending', icon: user?.isApproved ? '✅' : '⏳' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-neutral-border p-5">
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-display font-bold text-2xl text-text-primary mt-2">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Job List */}
        <div className="bg-white rounded-2xl border border-neutral-border p-6">
          <h2 className="font-display font-bold text-xl text-text-primary mb-4">Posted Jobs</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">No jobs posted yet</p>
              <Link to="/post-job" className="mt-2 inline-block text-primary text-sm hover:underline">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 bg-neutral-bg rounded-xl">
                  <div>
                    <p className="font-semibold text-text-primary">{job.title}</p>
                    <p className="text-xs text-text-muted">{job.location} · {job.applicantsCount} applicants</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/applicants/${job._id}`} className="text-sm text-primary hover:underline">View Applicants</Link>
                    <button onClick={() => { void handleDelete(job._id); }} className="text-sm text-red-500 hover:text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;