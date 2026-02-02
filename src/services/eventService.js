import api from '../lib/axios';

const BASE_URL = '/planner/events';

/**
 * Fetch all events
 */
export const getEventsAPI = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Create a new event
 */
export const createEventAPI = async (eventData) => {
  const response = await api.post(BASE_URL, eventData);
  return response.data;
};

/**
 * Update an existing event
 */
export const updateEventAPI = async (eventId, updates) => {
  const response = await api.put(`${BASE_URL}/${eventId}`, updates);
  return response.data;
};

/**
 * Delete an event
 */
export const deleteEventAPI = async (eventId) => {
  const response = await api.delete(`${BASE_URL}/${eventId}`);
  return response.data;
};
