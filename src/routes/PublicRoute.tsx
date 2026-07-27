import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common/Loading';
import { ROUTES } from '@/constants/routes';
import { isInsurerRole } from '@/constants/roles';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading fullPage message="Loading..." />;
  }

  if (isAuthenticated && user) {
    const targetDashboard = isInsurerRole(user.role)
      ? ROUTES.INSURER.DASHBOARD
      : ROUTES.PATIENT.DASHBOARD;
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
