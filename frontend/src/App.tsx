import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobListingPage from './pages/JobListingPage';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicantsPage from './pages/ApplicantsPage';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />

            {/* Protected - All authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected - Candidate only */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute roles={['candidate']}>
                  <MyApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected - Company only */}
            <Route
              path="/post-job"
              element={
                <ProtectedRoute roles={['company']}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicants/:jobId"
              element={
                <ProtectedRoute roles={['company']}>
                  <ApplicantsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected - Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;