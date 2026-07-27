import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized role to their respective home dashboard or 404
    return <Navigate to={user?.role === 'insurer' ? ROUTES.INSURER.DASHBOARD : ROUTES.PATIENT.DASHBOARD} replace />;
  }

  return <Outlet />;
};
