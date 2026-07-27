import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, RegisterFormData } from '@/types/auth';
import { UserRole } from '@/constants/roles';
import { LoginFormData } from '@/utils/validators';
import { authService } from '@/services/authService';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<User>;
  register: (data: RegisterFormData) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('claimflow_token');
      const storedUser = localStorage.getItem('claimflow_user');

      if (storedToken) {
        setToken(storedToken);
        try {
          // Validate session with live backend endpoint
          const userProfile = await authService.getMe();
          setUser(userProfile);
          localStorage.setItem('claimflow_user', JSON.stringify(userProfile));
        } catch {
          // Token invalid or expired
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              localStorage.removeItem('claimflow_token');
              localStorage.removeItem('claimflow_user');
            }
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('claimflow_token', response.token);
      localStorage.setItem('claimflow_user', JSON.stringify(response.user));
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('claimflow_token', response.token);
      localStorage.setItem('claimflow_user', JSON.stringify(response.user));
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('claimflow_token');
    localStorage.removeItem('claimflow_user');
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      role,
    };
    setUser(updatedUser);
    localStorage.setItem('claimflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
