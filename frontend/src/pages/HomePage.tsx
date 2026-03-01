import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔍', title: 'Smart Job Search', desc: 'Find opportunities filtered by title, location & type' },
  { icon: '📄', title: 'Easy Apply', desc: 'Upload your resume once and apply with one click' },
  { icon: '📊', title: 'Track Applications', desc: 'Monitor your application status in real-time' },
  { icon: '🏢', title: 'Verified Companies', desc: 'All companies are admin-verified for your safety' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-neutral-border shadow-sm mb-6">
            <span className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-text-secondary">Hiring is now open for 1000+ positions</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight mb-6">
            Pick the Best{' '}
            <span className="text-primary">Talent</span>
            {' '}or Your Next{' '}
            <span className="text-accent">Opportunity</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            TalentPicker connects ambitious candidates with top companies.
            Find your dream job or hire the perfect candidate — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <>
                <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md">
                  Browse Jobs →
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-text-primary font-semibold rounded-xl border border-neutral-border hover:bg-neutral-bg transition-colors">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md">
                  Find Jobs
                </Link>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-soft transition-colors shadow-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 pt-8 border-t border-neutral-border/50">
            {[['10,000+', 'Active Jobs'], ['5,000+', 'Companies'], ['50,000+', 'Candidates'], ['95%', 'Success Rate']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display font-bold text-2xl text-primary">{num}</p>
                <p className="text-sm text-text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-text-primary text-center mb-2">
            Everything you need to succeed
          </h2>
          <p className="text-text-secondary text-center mb-12">Powerful features for both job seekers and employers</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 bg-neutral-bg rounded-2xl border border-neutral-border hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-display font-semibold text-text-primary mt-3 mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-4 bg-primary">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to find your dream job?</h2>
            <p className="text-primary-light mb-8">Join thousands of professionals who found their perfect role through TalentPicker.</p>
            <Link to="/register" className="inline-block px-10 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-soft transition-colors shadow-md">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-text-primary py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-white">TalentPicker</span>
          </div>
          <p className="text-text-muted text-sm">© 2024 TalentPicker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;