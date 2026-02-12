import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/current_user');
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = useCallback(async () => {
    window.location.href = "/api/auth/google";
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, []);

  const switchRole = useCallback(() => {
    if (user && user.role === 'both') {
      setUser({
        ...user,
        currentRole: user.currentRole === 'admin' ? 'player' : 'admin',
      });
    }
  }, [user]);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
