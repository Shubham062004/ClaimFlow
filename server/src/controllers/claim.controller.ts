import { Request, Response } from 'express';
import { ClaimService } from '../services/claim.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createClaim = asyncHandler(async (req: Request, res: Response) => {
  const claim = await ClaimService.createClaim(req.user!, req.body, req.file);
  return ApiResponse.created(res, 'Claim submitted successfully.', claim);
});

export const getClaims = asyncHandler(async (req: Request, res: Response) => {
  const result = await ClaimService.getClaims(req.user!, req.query as any);
  return ApiResponse.ok(res, 'Claims retrieved successfully.', result.claims, result.pagination);
});

export const getClaimById = asyncHandler(async (req: Request, res: Response) => {
  const claim = await ClaimService.getClaimById(req.params.id as string, req.user!);
  return ApiResponse.ok(res, 'Claim details retrieved successfully.', claim);
});

export const updateClaim = asyncHandler(async (req: Request, res: Response) => {
  const updatedClaim = await ClaimService.updateClaim(req.params.id as string, req.body, req.user!);
  return ApiResponse.ok(res, 'Claim updated successfully.', updatedClaim);
});
