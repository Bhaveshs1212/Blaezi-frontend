import api from '../lib/axios';

/**
 * Fetch sanitized daily-plan context (no LLM).
 * Prefer puterPlanner.generateDailyPlan for full generation.
 */
export async function fetchDailyPlanContext(options = {}) {
  const body = {};
  if (options.availableMinutes != null && options.availableMinutes !== '') {
    body.availableMinutes = Number(options.availableMinutes);
  }
  if (options.focus) {
    body.focus = options.focus;
  }
  const response = await api.post('/ai/daily-plan/context', body);
  return response.data;
}

/**
 * @deprecated Server-side OpenAI generation removed. Use puterPlanner.generateDailyPlan.
 */
export async function generateDailyPlan(options = {}) {
  const { generateDailyPlan: puterGenerate } = await import('./puterPlanner');
  const data = await puterGenerate(options);
  return { success: true, data };
}
