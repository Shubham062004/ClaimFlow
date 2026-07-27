import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { RoleRoute } from '@/routes/RoleRoute';

import { LandingPage } from '@/pages/shared/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { PatientDashboardPage } from '@/pages/patient/PatientDashboardPage';
import { NewClaimPage } from '@/pages/patient/NewClaimPage';
import { MyClaimsPage } from '@/pages/patient/MyClaimsPage';
import { InsurerDashboardPage } from '@/pages/insurer/InsurerDashboardPage';
import { InsurerClaimsPage } from '@/pages/insurer/InsurerClaimsPage';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';

import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes Wrapped in Main Layout */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
      </Route>

      {/* Guest Authentication Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
      </Route>

      {/* Protected Portal Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Patient Specific Routes */}
          <Route element={<RoleRoute allowedRoles={[ROLES.PATIENT]} />}>
            <Route path={ROUTES.PATIENT.DASHBOARD} element={<PatientDashboardPage />} />
            <Route path={ROUTES.PATIENT.NEW_CLAIM} element={<NewClaimPage />} />
            <Route path={ROUTES.PATIENT.MY_CLAIMS} element={<MyClaimsPage />} />
          </Route>

          {/* Insurer Specific Routes */}
          <Route element={<RoleRoute allowedRoles={[ROLES.INSURER]} />}>
            <Route path={ROUTES.INSURER.DASHBOARD} element={<InsurerDashboardPage />} />
            <Route path={ROUTES.INSURER.CLAIMS} element={<InsurerClaimsPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Not Found & Wildcard Redirects */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Route>
    </Routes>
  );
};
