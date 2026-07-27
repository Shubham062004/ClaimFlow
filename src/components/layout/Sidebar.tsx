import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isPatientRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import {
  Shield,
  LayoutDashboard,
  FilePlus,
  FileText,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isPatient = isPatientRole(user?.role);

  const patientNav = [
    { label: 'Overview', path: ROUTES.PATIENT.DASHBOARD, icon: LayoutDashboard },
    { label: 'File New Claim', path: ROUTES.PATIENT.NEW_CLAIM, icon: FilePlus },
    { label: 'My Claims', path: ROUTES.PATIENT.MY_CLAIMS, icon: FileText },
  ];

  const insurerNav = [
    { label: 'Adjudication Hub', path: ROUTES.INSURER.DASHBOARD, icon: LayoutDashboard },
    { label: 'Claims Registry', path: ROUTES.INSURER.CLAIMS, icon: ClipboardList },
  ];

  const navItems = isPatient ? patientNav : insurerNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shadow-soft">
      {/* Platform Branding Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-soft shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight block text-base leading-tight">ClaimFlow</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {isPatient ? 'Patient Portal' : 'Insurer Adjudicator'}
          </span>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-slate-800 truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
