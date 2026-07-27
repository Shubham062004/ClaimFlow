import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { LoginFormData } from '@/utils/validators';
import { LoginResponse, User } from '@/types/auth';

/**
 * Service for handling Auth requests.
 * Includes mock fallbacks for testing without a live backend API server.
 */
export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch {
      // Mock successful login response for presentation & local frontend testing
      const mockUser: User = {
        id: credentials.role === 'patient' ? 'usr_pt_101' : 'usr_ins_909',
        email: credentials.email,
        name: credentials.role === 'patient' ? 'Eleanor Vance' : 'Dr. Marcus Vance (Insurer)',
        role: credentials.role,
        memberId: credentials.role === 'patient' ? 'MEM-9482-019' : undefined,
        organization: credentials.role === 'insurer' ? 'Apex Health Assurance' : undefined,
      };
      const mockToken = `mock_jwt_token_${credentials.role}_${Date.now()}`;
      return { user: mockUser, token: mockToken };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network errors on logout
    }
  },
};
