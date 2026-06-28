/// <reference types="vite/client" />
import axios from 'axios';

// Create a reusable Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every authenticated request using Axios interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('task_manager_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors like unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Unauthorized or expired token
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('task_manager_token');
        localStorage.removeItem('task_manager_user');
        
        // Only redirect if we are not already on login or register pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = `/login?expired=true`;
        }
      }
    } else {
      console.error('Network Error or server is unreachable:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
