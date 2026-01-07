import api from '../lib/axios';

/**
 * Get all career events with optional filters
 * @param {Object} filters - { type, status, starred }
 * @returns {Promise<Array>} Array of career events
 */
export async function getAllEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.status) params.append('status', filters.status);
  if (filters.starred !== undefined) params.append('starred', filters.starred);
  
  const response = await api.get(`/career?${params.toString()}`);
  return response.data;
}

/**
 * Get upcoming events
 * @param {number} limit - Number of events to return
 * @returns {Promise<Array>}
 */
export async function getUpcomingEvents(limit = 10) {
  const response = await api.get(`/career/upcoming?limit=${limit}`);
  return response.data;
}

/**
 * Get past events
 * @returns {Promise<Array>}
 */
export async function getPastEvents() {
  const response = await api.get('/career/past');
  return response.data;
}

/**
 * Get career statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getEventStats() {
  const response = await api.get('/career/stats');
  return response.data;
}

/**
 * Create a new career event
 * @param {Object} eventData - Event details
 * @returns {Promise<Object>} Created event
 */
export async function createEvent(eventData) {
  const response = await api.post('/career', eventData);
  return response.data;
}

/**
 * Get single event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Event object
 */
export async function getEventById(id) {
  const response = await api.get(`/career/${id}`);
  return response.data;
}

/**
 * Update an event
 * @param {string} id - Event ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated event
 */
export async function updateEvent(id, updates) {
  const response = await api.patch(`/career/${id}`, updates);
  return response.data;
}

/**
 * Delete an event
 * @param {string} id - Event ID
 * @returns {Promise<void>}
 */
export async function deleteEvent(id) {
  const response = await api.delete(`/career/${id}`);
  return response.data;
}

/**
 * Add preparation step to event
 * @param {string} eventId - Event ID
 * @param {Object} stepData - { title, description }
 * @returns {Promise<Object>} Updated event
 */
export async function addPreparationStep(eventId, stepData) {
  const response = await api.post(`/career/${eventId}/steps`, stepData);
  return response.data;
}

/**
 * Toggle step completion status
 * @param {string} eventId - Event ID
 * @param {string} stepId - Step ID
 * @param {boolean} isCompleted - Completion status
 * @returns {Promise<Object>} Updated event
 */
export async function toggleStepCompletion(eventId, stepId, isCompleted) {
  const response = await api.patch(`/career/${eventId}/steps/${stepId}`, { isCompleted });
  return response.data;
}

/**
 * Delete a preparation step
 * @param {string} eventId - Event ID
 * @param {string} stepId - Step ID
 * @returns {Promise<Object>} Updated event
 */
export async function deletePreparationStep(eventId, stepId) {
  const response = await api.delete(`/career/${eventId}/steps/${stepId}`);
  return response.data;
}
