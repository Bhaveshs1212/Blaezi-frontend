import api from '../lib/axios';

/**
 * Get user's projects with filters
 * @param {Object} filters - { status, starred, language }
 * @returns {Promise<Array>}
 */
export async function fetchProjects(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.starred !== undefined) params.append('starred', filters.starred);
  if (filters.language) params.append('language', filters.language);
  
  const response = await api.get(`/projects?${params.toString()}`);
  return response.data;
}

/**
 * Get starred projects
 * @returns {Promise<Array>}
 */
export async function getStarredProjects() {
  const response = await api.get('/projects/starred');
  return response.data;
}

/**
 * Get project statistics
 * @returns {Promise<Object>}
 */
export async function getProjectStats() {
  const response = await api.get('/projects/stats');
  return response.data;
}

/**
 * Get single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>}
 */
export async function getProjectById(id) {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

/**
 * Sync projects from GitHub - Backend handles fetching
 * @param {string} githubUsername - GitHub username
 * @param {Object} filters - Optional filters { language, minStars, excludeForks, onlyPublic }
 * @returns {Promise<Object>}
 */
export async function syncFromGitHub(githubUsername, filters = {}) {
  const response = await api.post('/projects/sync', { 
    githubUsername,
    filters: {
      excludeForks: true,
      onlyPublic: true,
      ...filters
    }
  });
  return response.data;
}

/**
 * Update project details
 * @param {string} id - Project ID
 * @param {Object} updates - { status, progress, notes, techStack, starred }
 * @returns {Promise<Object>}
 */
export async function updateProject(id, updates) {
  const response = await api.patch(`/projects/${id}`, updates);
  return response.data;
}

/**
 * Delete/archive a project
 * @param {string} id - Project ID
 * @returns {Promise<void>}
 */
export async function deleteProject(id) {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
}
