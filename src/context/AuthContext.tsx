import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { User, AuthResponse, UserResponse } from '../types';
import { useToast } from './ToastContext';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  // Load user from localstorage / autoLogin
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('task_manager_token');
      const storedUser = localStorage.getItem('task_manager_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        try {
          // Verify token against /api/auth/me
          const response = await api.get<UserResponse>('/auth/me');
          setUser(response.data.user);
          localStorage.setItem('task_manager_user', JSON.stringify(response.data.user));
        } catch (err) {
          // If token verification fails, Axios interceptor will clear localStorage
          console.error('Auto login verification failed:', err);
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('task_manager_token', receivedToken);
      localStorage.setItem('task_manager_user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      
      success('Logged In Successfully', `Welcome back, ${receivedUser.name}!`);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      error('Login Error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('task_manager_token', receivedToken);
      localStorage.setItem('task_manager_user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      
      success('Registration Successful', `Welcome, ${receivedUser.name}!`);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      error('Registration Error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  const logout = useCallback(() => {
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
    setToken(null);
    setUser(null);
    success('Logged Out', 'You have been logged out successfully.');
  }, [success]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
