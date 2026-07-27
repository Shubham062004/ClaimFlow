import { Router } from 'express';
import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
} from '../controllers/claim.controller.js';
import {
  createClaimValidation,
  updateClaimValidation,
  getClaimByIdValidation,
  getClaimsQueryValidation,
} from '../validators/claim.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { uploadClaimDocument } from '../middleware/upload.middleware.js';
import { UserRole } from '../types/user.types.js';

const router = Router();

// Apply JWT authentication to all claims endpoints
router.use(authenticate);

// POST /api/claims -> Create claim (Patient or Admin role)
router.post(
  '/',
  authorize(UserRole.PATIENT, UserRole.ADMIN),
  uploadClaimDocument,
  createClaimValidation,
  validateRequest,
  createClaim
);

// GET /api/claims -> Get all claims (Scoped by role)
router.get(
  '/',
  getClaimsQueryValidation,
  validateRequest,
  getClaims
);

// GET /api/claims/:id -> Get claim by ID
router.get(
  '/:id',
  getClaimByIdValidation,
  validateRequest,
  getClaimById
);

// PATCH /api/claims/:id -> Update claim status/adjudication (Insurer or Admin role)
router.patch(
  '/:id',
  authorize(UserRole.INSURER, UserRole.ADMIN),
  updateClaimValidation,
  validateRequest,
  updateClaim
);

export default router;
