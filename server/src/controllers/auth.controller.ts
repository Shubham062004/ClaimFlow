import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });

  return ApiResponse.ok(res, 'Login successful.', result);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });

  return ApiResponse.created(res, 'Patient account registered successfully.', result);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('token');
  return ApiResponse.ok(res, 'Logout successful.', null);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userProfile = await AuthService.getUserProfile(req.user!.id);
  return ApiResponse.ok(res, 'Current user profile retrieved.', userProfile);
});
