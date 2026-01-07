import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { login as loginService, register as registerService, getMe, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  console.log('[AuthProvider] RENDER');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);
  const initializingRef = useRef(false);

  // Check if user is logged in on mount
  useEffect(() => {
    if (initializedRef.current || initializingRef.current) {
      console.log('[AuthContext] Already initialized or initializing, skipping...');
      return;
    }
    
    initializingRef.current = true;
    console.log('[AuthContext] Initializing...');
    
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          console.log('[AuthContext] Found stored token, validating...');
          
          // Verify token is still valid by fetching current user
          try {
            const response = await getMe();
            const userData = response.data || response.user;
            setToken(storedToken);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('[AuthContext] Token validated successfully');
          } catch (err) {
            console.log('[AuthContext] Token validation failed, clearing auth data');
            // Token invalid - clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Don't set to null - they're already null
          }
        } else {
          console.log('[AuthContext] No stored token found');
        }
      } catch (error) {
        console.error('[AuthContext] Initialization error:', error);
        // Clear everything on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        initializedRef.current = true;
        initializingRef.current = false;
        console.log('[AuthContext] Initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      console.log('AuthContext: Attempting login...');
      const response = await loginService(credentials);
      console.log('AuthContext: Login response received:', response);
      const { token: newToken, user: userData } = response;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('AuthContext: Login successful');
      return { success: true };
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      
      let message = 'Login failed';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please check if the backend is running on port 4000.';
      } else if (err.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setError(null);
      console.log('Attempting registration with:', { email: data.email, name: data.name });
      const response = await registerService(data);
      console.log('Registration response:', response);
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      
      let message = 'Registration failed';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message === 'Network Error') {
        message = 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Network error. Please check your connection and backend server.';
      } else if (err.response?.status === 400) {
        message = err.response.data?.message || 'Invalid registration data';
      } else if (err.response?.status === 409) {
        message = 'Email already exists. Please use a different email or login.';
      }
      
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    logoutService();
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }), [user, token, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
