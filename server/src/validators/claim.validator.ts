import { body, param, query } from 'express-validator';
import { ClaimStatus } from '../types/claim.types.js';

export const createClaimValidation = [
  body('provider')
    .trim()
    .notEmpty()
    .withMessage('Healthcare provider name is required'),
  body('claimAmount')
    .notEmpty()
    .withMessage('Claim amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Claim amount must be a number greater than 0'),
  body('diagnosisCode')
    .trim()
    .notEmpty()
    .withMessage('Diagnosis code is required'),
  body('procedureCode')
    .trim()
    .notEmpty()
    .withMessage('Procedure code is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
];

export const updateClaimValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid claim ID format'),
  body('status')
    .optional()
    .isIn(Object.values(ClaimStatus))
    .withMessage(`Status must be one of: ${Object.values(ClaimStatus).join(', ')}`),
  body('approvedAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Approved amount must be a non-negative number'),
  body('comments')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comments cannot exceed 1000 characters'),
];

export const getClaimByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid claim ID format'),
];

export const getClaimsQueryValidation = [
  query('status')
    .optional()
    .isIn(Object.values(ClaimStatus))
    .withMessage(`Status filter must be one of: ${Object.values(ClaimStatus).join(', ')}`),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
