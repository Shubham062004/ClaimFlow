import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/constants/roles';
import { User, LogOut, RefreshCw, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();

  const handleRoleToggle = () => {
    if (!user) return;
    const nextRole = user.role === ROLES.PATIENT ? ROLES.INSURER : ROLES.PATIENT;
    switchRole(nextRole);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-soft px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-900 capitalize flex items-center gap-2">
          <span>{user?.role} Portal</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200/60">
            Active
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Demo Switch Role button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRoleToggle}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-blue-600" />}
          className="hidden sm:inline-flex text-xs"
        >
          Switch to {user?.role === ROLES.PATIENT ? 'Insurer' : 'Patient'}
        </Button>

        {/* Notifications Icon Placeholder */}
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</span>
            <span className="text-[10px] text-slate-500">{user?.email}</span>
          </div>
        </div>

        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-slate-500 hover:text-red-600 p-2 h-8 w-8"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
