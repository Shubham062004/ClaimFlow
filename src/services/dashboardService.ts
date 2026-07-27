import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface DashboardMetrics {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalClaimAmount: number;
  totalAmount: number;
  totalApprovedAmount: number;
  recentClaims: any[];
  latestClaims: any[];
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<{ success: boolean; data: DashboardMetrics }>(
      API_ENDPOINTS.DASHBOARD.METRICS
    );
    return response.data.data;
  },
};
