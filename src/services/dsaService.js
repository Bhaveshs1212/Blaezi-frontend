import api from '../lib/axios';

/**
 * Get all DSA problems from catalog (public)
 * @param {Object} filters - { source, difficulty, topic, sheet, platform, search }
 * @returns {Promise<Array>} Array of problems
 */
export async function fetchDsaProblems(filters = {}) {
  const params = new URLSearchParams();
  
  // REQUIRED: source parameter for fetching from Striver
  if (filters.source) params.append('source', filters.source);
  
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.sheet) params.append('sheet', filters.sheet);
  if (filters.platform) params.append('platform', filters.platform);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/dsa/problems?${params.toString()}`);
  return response.data;
}

/**
 * Get single problem by ID (public)
 * @param {string} id - Problem ID
 * @returns {Promise<Object>}
 */
export async function getProblemById(id) {
  const response = await api.get(`/dsa/problems/${id}`);
  return response.data;
}

/**
 * Get user's progress on problems (protected)
 * @param {Object} filters - { status, starred }
 * @returns {Promise<Array>}
 */
export async function getUserProgress(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.starred !== undefined) params.append('starred', filters.starred);
  
  const response = await api.get(`/dsa/progress?${params.toString()}`);
  return response.data;
}

/**
 * Create or update progress on a problem (protected)
 * @param {Object} data - { problemId, status, notes, approach, starred }
 * @returns {Promise<Object>}
 */
export async function createOrUpdateProgress(data) {
  const response = await api.post('/dsa/progress', data);
  return response.data;
}

/**
 * Update specific fields in progress (protected)
 * @param {string} problemId - Problem ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
export async function updateProgress(problemId, updates) {
  const response = await api.patch(`/dsa/progress/${problemId}`, updates);
  return response.data;
}

/**
 * Delete progress tracking for a problem (protected)
 * @param {string} problemId - Problem ID
 * @returns {Promise<void>}
 */
export async function deleteProgress(problemId) {
  const response = await api.delete(`/dsa/progress/${problemId}`);
  return response.data;
}

/**
 * Get user's DSA statistics (protected)
 * @returns {Promise<Object>} Stats object with counts
 */
export async function getUserStats() {
  const response = await api.get('/dsa/stats');
  return response.data;
}

/**
 * Get problems that need revision (protected)
 * @param {number} days - Days since last solved (default: 7)
 * @returns {Promise<Array>}
 */
export async function getStaleProblems(days = 7) {
  const response = await api.get(`/dsa/stale?days=${days}`);
  return response.data;
}
