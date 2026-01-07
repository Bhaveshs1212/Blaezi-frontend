import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status, response.data);
    return response;
  },
  (error) => {
    // Log detailed error information
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received:', {
        url: error.config?.url,
        message: error.message,
        baseURL: error.config?.baseURL
      });
    } else {
      // Error in request setup
      console.error('[API Error] Request setup failed:', error.message);
    }
    
    // Handle 401 Unauthorized - Token expired or invalid
    // But skip auto-redirect for auth endpoints to avoid infinite loops
    // These endpoints have their own error handling:
    // - /auth/login and /auth/register handle errors in the form
    // - /auth/me is handled by AuthContext initialization
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = 
        requestUrl.includes('/auth/login') || 
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/me');
      
      // Only redirect if not on public pages and not an auth endpoint
      const currentPath = window.location.pathname;
      const isPublicPage = currentPath === '/' || currentPath === '/login' || currentPath === '/signup';
      
      if (!isAuthEndpoint && !isPublicPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
