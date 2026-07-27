export const ROLES = {
  PATIENT: 'patient',
  INSURER: 'insurer',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
