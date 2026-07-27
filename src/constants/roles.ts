export const ROLES = {
  PATIENT: 'patient',
  INSURER: 'insurer',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES] | 'Patient' | 'Insurer' | 'Admin';

export const isInsurerRole = (role?: string): boolean => {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === 'insurer' || r === 'admin';
};

export const isPatientRole = (role?: string): boolean => {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === 'patient';
};
