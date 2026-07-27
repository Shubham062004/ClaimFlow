import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { isInsurerRole } from '@/constants/roles';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return ROUTES.LOGIN;
    return isInsurerRole(user.role) ? ROUTES.INSURER.DASHBOARD : ROUTES.PATIENT.DASHBOARD;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1">
              ClaimFlow
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Claims Platform</span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardRoute()}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard ({user?.role})
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Access Portal
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
