import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { UserRole, ROLES } from '@/constants/roles';
import { LoginFormData } from '@/utils/validators';
import { authService } from '@/services/authService';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for persisted session on initial mount
    const storedToken = localStorage.getItem('claimflow_token');
    const storedUser = localStorage.getItem('claimflow_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user session', e);
        localStorage.removeItem('claimflow_token');
        localStorage.removeItem('claimflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('claimflow_token', response.token);
      localStorage.setItem('claimflow_user', JSON.stringify(response.user));
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
      name: role === ROLES.PATIENT ? 'Eleanor Vance (Patient)' : 'Dr. Marcus Vance (Insurer)',
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
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
