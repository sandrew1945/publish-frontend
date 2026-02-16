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
      }
    }
    return Promise.reject(error);
  }
);
