export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

export interface DashboardMetricsDTO {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalClaimAmount: number;
  totalApprovedAmount: number;
  recentClaims: any[];
}
