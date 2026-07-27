import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

interface RoleRouteProps {
  allowedRoles: (UserRole | string)[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userRoleNormalized = user.role.toLowerCase();
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRoleNormalized
  );

  if (!isAllowed) {
    const isInsurer = userRoleNormalized === 'insurer';
    return <Navigate to={isInsurer ? ROUTES.INSURER.DASHBOARD : ROUTES.PATIENT.DASHBOARD} replace />;
  }

  return <Outlet />;
};
