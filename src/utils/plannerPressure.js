/**
 * Planner Pressure Calculation
 * -----------------------------
 * Pressure based on:
 * - Overdue tasks (highest pressure)
 * - Tasks due today (high pressure)
 * - Tasks due tomorrow (moderate pressure)
 * - Incomplete daily goals
 */

/**
 * Normalize pressure to 0-100 range
 */
function normalizePressure(pressure) {
  return Math.min(100, Math.max(0, pressure));
}

/**
 * Calculate pressure from tasks
 * @param {Array} tasks - Array of task objects
 * @returns {number} Pressure value (0-100)
 */
export function calculatePlannerPressure(tasks) {
  if (!tasks || tasks.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let pressure = 0;

  // Filter incomplete tasks only
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Count tasks by urgency
  let overdueTasks = 0;
  let todayTasks = 0;
  let tomorrowTasks = 0;

  incompleteTasks.forEach(task => {
    if (!task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      overdueTasks++;
    } else if (dueDate.getTime() === today.getTime()) {
      todayTasks++;
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      tomorrowTasks++;
    }
  });

  // Calculate pressure with weighted scores
  pressure += overdueTasks * 30;    // Each overdue task adds 30 pressure
  pressure += todayTasks * 20;       // Each today task adds 20 pressure
  pressure += tomorrowTasks * 10;    // Each tomorrow task adds 10 pressure

  // Add base pressure if there are many incomplete tasks
  if (incompleteTasks.length > 10) {
    pressure += 15;
  }

  return normalizePressure(pressure);
}

/**
 * Get planner status description
 * @param {number} pressure - Pressure value (0-100)
 * @returns {Object} Status with level and message
 */
export function getPlannerStatus(pressure) {
  if (pressure >= 80) {
    return {
      level: 'critical',
      message: 'Heavy task load - prioritize immediately',
      color: '#E11D48'
    };
  } else if (pressure >= 60) {
    return {
      level: 'high',
      message: 'Multiple urgent tasks pending',
      color: '#F59E0B'
    };
  } else if (pressure >= 40) {
    return {
      level: 'moderate',
      message: 'Stay on track with your tasks',
      color: '#EAB308'
    };
  } else if (pressure >= 20) {
    return {
      level: 'low',
      message: 'Good progress on daily tasks',
      color: '#10B981'
    };
  } else {
    return {
      level: 'minimal',
      message: 'All tasks under control',
      color: '#6366F1'
    };
  }
}
