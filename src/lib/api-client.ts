import { toast } from 'sonner';
import { Api } from './api';

// Create the typed API instance
export const backendApi = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backward compatibility: export the axios instance used by the typed API
export const apiClient = backendApi.instance;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attempt to get SID from localStorage or cookie
    if (typeof window !== 'undefined') {
      const sid = localStorage.getItem('sid');
      if (sid) {
        config.headers['sid'] = sid;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response;
    // Check if the response follows the { result: false, msg: "..." } structure
    if (data && data.result === false && data.msg) {
      toast.error(data.msg);
      // We do NOT reject here because the caller (UI components) might not catch the error,
      // leading to "Unhandled Runtime Error" in dev mode.
      // We rely on the toast to notify the user.
      // The caller will still receive the response and can check result: false if needed.
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle unauthorized access
        if (typeof window !== 'undefined') {
          // Redirect to login or clear session
          localStorage.removeItem('sid');
          document.cookie = 'sid=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        }
      } else {
        // Handle other HTTP errors
        const msg = error.response.data?.msg || error.message || 'An error occurred';
        toast.error(msg);
      }
    } else {
      // Handle network errors or other issues
      toast.error(error.message || 'Network Error');
    }
    return Promise.reject(error);
  }
);
