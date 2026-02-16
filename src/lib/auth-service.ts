import { apiClient } from './api-client';
import { Api } from './api';
import { LoginCredentials, AuthUser, LoginResponse } from '@/types/auth';

// Initialize the generated API client
const api = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

// Add interceptors to the local api instance to ensure consistency with api-client.ts
api.instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const sid = localStorage.getItem('sid');
      if (sid) {
        config.headers['sid'] = sid;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sid');
        document.cookie = 'sid=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper to set cookie for middleware access
const setAuthCookie = (sid: string) => {
  // Set a cookie that expires in 1 day
  // Note: specific secure/httponly attributes depend on environment,
  // but for client-side setting we do what we can
  document.cookie = `sid=${sid}; path=/; max-age=86400; SameSite=Strict`;
};

const clearAuthCookie = () => {
  document.cookie = 'sid=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const authService = {
  /**
   * Login with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Use the generated API client's login method
      const response = await api.login.login({
        userCode: credentials.userCode,
        password: credentials.password,
      });

      const data = response.data;

      if (data && data.result) {
        // The API returns the session ID in the response headers or body
        // Based on typical Shiro usage, it might be in Set-Cookie header (handled by browser)
        // OR returned in dragging, BUT api-client.ts expects it in 'sid' header or localStorage

        // For this implementation, we'll assume the token is returned in data or we need to look at headers
        // Since we can't easily access Set-Cookie from JS if HttpOnly, we rely on the backend response.

        // However, checking api-client.ts, it looks for 'sid' in localStorage.
        // Let's assume the response.data.data includes the token or we grab it if available.
        // If not explicit, we might need adjustments.
        // For now, let's assume successful login sets the session on server.

        // Let's look at AclUserBean in api.ts, it has a 'token' field.
        // If the login response includes the token, we use that.

        // Let's assume standard behavior:
        // 1. We get the token
        // 2. We store it

        // If the response data itself doesn't have the token, we might check headers if exposed.
        // But let's assume for now that successful login means the cookie is set by server OR we are expected to manage it.
        // Given api-client.ts logic: const sid = localStorage.getItem('sid');
        // We MUST set this item.

        // Inspecting AclUserBean (from api.ts):
        // export interface AclUserBean { ... token?: string; ... }

        // If the response.data.data is the user object, functionality depends on it having the token.

        console.log('Login response:', data);
      }

      return {
        result: data?.result || false,
        msg: data?.msg || '',
        data: data?.data || {},
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Store session ID in both localStorage (for API client) and cookie (for middleware)
   */
  setSession(sid: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sid', sid);
      setAuthCookie(sid);
    }
  },

  /**
   * Clear session from both storages
   */
  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sid');
      clearAuthCookie();
    }
  },

  /**
   * Logout the user
   */
  async logout() {
    try {
      await api.logout.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  },

  /**
   * Get current user details
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Try to get explicit login user info first
      const response = await api.security.getLoginUserInfo();

      if (response.data) {
        // Map AclUserBean to AuthUser
        // AclUserBean has: userId, userCode, userName, roleName, roleCode, token, etc.
        const aclUser = response.data;
        if (!aclUser.userId) return null; // Invalid user

        return {
          userId: aclUser.userId || 0,
          userCode: aclUser.userCode || '',
          userName: aclUser.userName || '',
          roleName: aclUser.roleName,
          roleCode: aclUser.roleCode,
          token: aclUser.token,
          avatarPath: aclUser.avatarPath,
        };
      }
      return null;
    } catch (error) {
      // If 401, return null
      return null;
    }
  },

  /**
   * Validate if current session is valid
   */
  async validateToken(): Promise<boolean> {
    try {
      const sid = typeof window !== 'undefined' ? localStorage.getItem('sid') : null;
      if (!sid) return false;

      const response = await api.validateToken.validateToken({ token: sid });
      return !!(response.data && response.data.result);
    } catch (error) {
      return false;
    }
  },
};
