export type UserRole = 'Patient' | 'Insurer' | 'Admin' | 'patient' | 'insurer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  memberId?: string;
  organization?: string;
  createdAt?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
