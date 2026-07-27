import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await DashboardService.getMetrics(req.user!);
  return ApiResponse.ok(res, 'Dashboard metrics retrieved successfully.', metrics);
});
