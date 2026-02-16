'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from './auth-service';
import { AuthState, AuthUser, LoginCredentials } from '@/types/auth';
import { Spinner } from '@/components/spinner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = async () => {
    try {
      const user = await authService.getCurrentUser();

      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // If we're not authenticated and not on a public page, redirect to login
        // Note: Middleware handles the main protection, but this is a client-side fallback
        if (pathname !== '/login' && pathname !== '/') {
          // Optional: redirect here or let middleware handle it
        }
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);

      if (response && response.result) {
        // Build the session cookie/localStorage
        // Assuming response.data contains the token or user info with token
        // Based on typical usage, the token might be in header or body
        // But let's assume successful login sets it

        // IMPORTANT: In a real app we'd get the token from response.data or headers
        // For this scaffold, we'll assume response.data.token exists or similar
        // If not, we might need to adjust based on API behavior.
        // Assuming 'token' is in response.data for simplicity
        const token = response.data?.token || response.data?.sessionId;
        if (token) {
          authService.setSession(token);
        }

        // Fetch full user details
        await checkAuth();
        router.push('/dashboard');
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response?.msg || 'Login failed',
        }));
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An error occurred during login',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {state.isLoading && pathname !== '/login' && pathname !== '/' ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Spinner className="h-10 w-10 text-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
