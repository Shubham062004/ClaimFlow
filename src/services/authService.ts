import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { LoginFormData } from '@/utils/validators';
import { LoginResponse, User, RegisterFormData } from '@/types/auth';

/**
 * Service for handling Authentication API requests.
 */
export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email: credentials.email,
        password: credentials.password,
      }
    );
    return response.data.data;
  },

  async register(data: RegisterFormData): Promise<LoginResponse> {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network errors during logout
    }
  },
};
