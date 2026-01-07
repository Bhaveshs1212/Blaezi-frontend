import api from '../lib/axios';

/**
 * Register a new user
 * @param {Object} data - { email, password, name }
 * @returns {Promise<{token: string, user: Object}>}
 */
export async function register(data) {
  try {
    console.log('Auth service: Registering user...');
    const response = await api.post('/auth/register', data);
    console.log('Auth service: Registration successful', response.data);
    return response.data;
  } catch (error) {
    console.error('Auth service: Registration failed', error);
    throw error;
  }
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{token: string, user: Object}>}
 */
export async function login(credentials) {
  try {
    console.log('Auth service: Attempting login with:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('Auth service: Login successful', response.data);
    return response.data;
  } catch (error) {
    console.error('Auth service: Login failed', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get current user profile
 * @returns {Promise<Object>} User object
 */
export async function getMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Update user profile
 * @param {Object} updates - { name, githubUsername, avatar }
 * @returns {Promise<Object>} Updated user
 */
export async function updateProfile(updates) {
  const response = await api.patch('/auth/profile', updates);
  return response.data;
}

/**
 * Logout user (client-side only)
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
