import { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import Toast from '../components/common/Toast';
import type { User, Job } from '../types';

type Tab = 'overview' | 'users' | 'jobs';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  pendingCompanies: number;
}

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingCompanies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          axiosInstance.get<{ success: boolean; data: AdminStats }>('/admin/stats'),
          axiosInstance.get<{ success: boolean; data: User[] }>('/admin/users'),
          axiosInstance.get<{ success: boolean; data: Job[] }>('/admin/jobs'),
        ]);
        if (statsRes.data?.data) setStats(statsRes.data.data);
        if (usersRes.data?.data) setUsers(usersRes.data.data);
        if (jobsRes.data?.data) setJobs(jobsRes.data.data);
      } catch (err) {
        console.error('Admin fetch error:', err);
        setToast({ message: 'Failed to load admin data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    void fetchAll();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/admin/companies/${id}/approve`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isApproved: true } : u));
      setToast({ message: 'Company approved!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to approve', type: 'error' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user? This will remove all their data.')) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setToast({ message: 'User deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete user', type: 'error' });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try {
      await axiosInstance.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setToast({ message: 'Job deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete job', type: 'error' });
    }
  };

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users', count: users.length },
    { id: 'jobs', label: '💼 Jobs', count: jobs.length },
  ];

  const statCards = [
    { label: 'Candidates', value: stats.totalUsers, icon: '👤', color: 'bg-blue-50 border-blue-100' },
    { label: 'Companies', value: stats.totalCompanies, icon: '🏢', color: 'bg-purple-50 border-purple-100' },
    { label: 'Total Jobs', value: stats.totalJobs, icon: '💼', color: 'bg-green-50 border-green-100' },
    { label: 'Applications', value: stats.totalApplications, icon: '📋', color: 'bg-yellow-50 border-yellow-100' },
    {
      label: 'Pending Approval',
      value: stats.pendingCompanies,
      icon: '⏳',
      color: stats.pendingCompanies > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">Admin Panel</h1>
          <p className="text-text-secondary mt-1">Manage TalentPicker platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-neutral-border p-1 w-fit mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                tab === t.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-neutral-bg'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20 text-white' : 'bg-neutral-bg text-text-muted'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-neutral-border p-5 animate-pulse">
                    <div className="w-8 h-8 bg-neutral-bg rounded-lg mb-3" />
                    <div className="h-6 bg-neutral-bg rounded w-12 mb-2" />
                    <div className="h-3 bg-neutral-bg rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((stat) => (
                  <div key={stat.label} className={`bg-white rounded-xl border p-5 ${stat.color}`}>
                    <span className="text-2xl">{stat.icon}</span>
                    <p className="font-display font-bold text-3xl text-text-primary mt-2">{stat.value}</p>
                    <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pending companies alert */}
            {stats.pendingCompanies > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-800">{stats.pendingCompanies} companies awaiting approval</p>
                    <p className="text-sm text-yellow-700">Go to Users tab to approve them</p>
                  </div>
                </div>
                <button
                  onClick={() => setTab('users')}
                  className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
            <div className="p-4 border-b border-neutral-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-text-primary">
                All Users <span className="text-text-muted font-normal text-sm">({users.length})</span>
              </h2>
              <div className="flex gap-2 text-xs text-text-muted">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {users.filter(u => u.role === 'candidate').length} candidates
                </span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                  {users.filter(u => u.role === 'company').length} companies
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-text-muted">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No users found</div>
            ) : (
              <div className="divide-y divide-neutral-border max-h-[600px] overflow-y-auto">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-4 hover:bg-neutral-bg/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{u.name}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                        {u.role === 'company' && u.companyName && (
                          <p className="text-xs text-primary">{u.companyName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        u.role === 'company' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                      {u.role === 'company' && !u.isApproved && (
                        <button
                          onClick={() => { void handleApprove(u._id); }}
                          className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {u.role === 'company' && u.isApproved && (
                        <span className="text-xs text-green-600 font-medium">✓ Approved</span>
                      )}
                      <button
                        onClick={() => { void handleDeleteUser(u._id); }}
                        className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
            <div className="p-4 border-b border-neutral-border">
              <h2 className="font-display font-semibold text-text-primary">
                All Jobs <span className="text-text-muted font-normal text-sm">({jobs.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-text-muted">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No jobs found</div>
            ) : (
              <div className="divide-y divide-neutral-border max-h-[600px] overflow-y-auto">
                {jobs.map((job) => {
                  const company = typeof job.companyId === 'object' ? job.companyId : null;
                  return (
                    <div key={job._id} className="flex items-center justify-between p-4 hover:bg-neutral-bg/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-sm">
                            {(company?.companyName ?? 'C').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{job.title}</p>
                          <p className="text-xs text-text-muted">
                            {company?.companyName ?? 'Company'} · {job.location}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">{job.type}</span>
                            <span className="text-xs text-text-muted">👥 {job.applicantsCount} applicants</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { void handleDeleteJob(job._id); }}
                        className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-medium flex-shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;