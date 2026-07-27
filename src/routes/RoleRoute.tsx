import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

interface RoleRouteProps {
  allowedRoles: (UserRole | string)[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  const userRoleNormalized = user.role.toLowerCase();
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRoleNormalized
  );

  useEffect(() => {
    if (!isAllowed) {
      const requiredRoleName = allowedRoles[0];
      toast.error(`Access Restricted: Please log in with an ${requiredRoleName} account to access this page.`);
      logout();
    }
  }, [isAllowed]);

  if (!isAllowed) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
