import api from '../lib/axios';

/**
 * Get all tasks with optional filters
 * @param {Object} filters - { completed, dueDate, goalId, archived }
 * @returns {Promise<Array>} Array of tasks
 */
export async function getAllTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.completed !== undefined) params.append('completed', filters.completed);
  if (filters.dueDate) params.append('dueDate', filters.dueDate);
  if (filters.goalId) params.append('goalId', filters.goalId);
  if (filters.archived !== undefined) params.append('archived', filters.archived);
  
  const response = await api.get(`/planner/tasks?${params.toString()}`);
  return response.data;
}

/**
 * Get a single task by ID
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Task object
 */
export async function getTask(id) {
  const response = await api.get(`/planner/tasks/${id}`);
  return response.data;
}

/**
 * Create a new task
 * @param {Object} taskData - Task details
 * @returns {Promise<Object>} Created task
 */
export async function createTask(taskData) {
  const response = await api.post('/planner/tasks', taskData);
  return response.data;
}

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(id, updates) {
  const response = await api.patch(`/planner/tasks/${id}`, updates);
  return response.data;
}

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  const response = await api.delete(`/planner/tasks/${id}`);
  return response.data;
}

/**
 * Bulk update tasks (for reordering or batch status changes)
 * @param {Array} tasks - Array of task objects with updated fields
 * @returns {Promise<Array>} Updated tasks
 */
export async function bulkUpdateTasks(tasks) {
  const response = await api.post('/planner/tasks/bulk-update', { tasks });
  return response.data;
}

/**
 * Get all goals
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of goals
 */
export async function getAllGoals(filters = {}) {
  const params = new URLSearchParams();
  const response = await api.get(`/planner/goals?${params.toString()}`);
  return response.data;
}

/**
 * Create a new goal
 * @param {Object} goalData - Goal details
 * @returns {Promise<Object>} Created goal
 */
export async function createGoal(goalData) {
  const response = await api.post('/planner/goals', goalData);
  return response.data;
}

/**
 * Update a goal
 * @param {string} id - Goal ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated goal
 */
export async function updateGoal(id, updates) {
  const response = await api.patch(`/planner/goals/${id}`, updates);
  return response.data;
}

/**
 * Delete a goal
 * @param {string} id - Goal ID
 * @returns {Promise<void>}
 */
export async function deleteGoal(id) {
  const response = await api.delete(`/planner/goals/${id}`);
  return response.data;
}

/**
 * Get planner statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getPlannerStats() {
  const response = await api.get('/planner/stats');
  return response.data;
}

/**
 * Get activity data for the last 7 days
 * @returns {Promise<Array>} Activity data for chart
 */
export async function getActivityData() {
  const response = await api.get('/planner/activity');
  return response.data;
}
