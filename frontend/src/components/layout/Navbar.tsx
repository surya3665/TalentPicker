import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `font-sans font-medium text-sm transition-colors duration-200 ${
      isActive(path) ? 'text-primary' : 'text-text-secondary hover:text-primary'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            
            <img src={logo} alt="TalentPicker" className="h-20 w-auto" />
            
            <span className="font-display font-bold text-xl text-text-primary">
              Talent<span className="text-primary">Picker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className={navLinkClass('/jobs')}>Browse Jobs</Link>
            {user?.role === 'candidate' && (
              <Link to="/my-applications" className={navLinkClass('/my-applications')}>My Applications</Link>
            )}
            {user?.role === 'company' && (
              <>
                <Link to="/post-job" className={navLinkClass('/post-job')}>Post Job</Link>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={navLinkClass('/admin')}>Admin Panel</Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-text-primary hidden lg:block">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-text-secondary border border-neutral-border rounded-lg hover:bg-neutral-bg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-soft transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-bg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-neutral-border pt-4">
            <Link to="/jobs" className="block py-2 text-sm font-medium text-text-secondary hover:text-primary" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            {user?.role === 'candidate' && (
              <Link to="/my-applications" className="block py-2 text-sm font-medium text-text-secondary hover:text-primary" onClick={() => setMenuOpen(false)}>My Applications</Link>
            )}
            {user?.role === 'company' && (
              <>
                <Link to="/post-job" className="block py-2 text-sm font-medium text-text-secondary hover:text-primary" onClick={() => setMenuOpen(false)}>Post Job</Link>
                <Link to="/dashboard" className="block py-2 text-sm font-medium text-text-secondary hover:text-primary" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="block py-2 text-sm font-medium text-text-secondary hover:text-primary" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium text-red-500 hover:text-red-600">
                Logout
              </button>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 text-center py-2 text-sm font-medium border border-neutral-border rounded-lg" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-accent rounded-lg" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;