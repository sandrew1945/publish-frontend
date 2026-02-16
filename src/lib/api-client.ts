import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Attempt to get SID from localStorage or cookie
    // For this scaffold, we'll try localStorage first, then fallback to logic as needed
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
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
