/**
 * Calculate career / exam pressure based on approaching deadlines.
 * Pressure increases smoothly as deadline approaches.
 *
 * @param {Array} events - career events with a `date` field
 * @param {Object} config - optional tuning parameters
 * @returns {number} pressure (0–100)
 */
export function calculateCareerPressure(
  events,
  config = {
    decayRate: 30, // lower = pressure rises faster
    maxPressure: 100,
  }
) {
  if (!events || events.length === 0) return 0;

  const today = new Date();
  let maxPressure = 0;

  events.forEach((event) => {
    const deadline = new Date(event.date);

    const daysLeft = Math.max(
      0,
      Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    );

    // Continuous exponential pressure curve
    const pressure = Math.min(
      config.maxPressure,
      Math.round(
        config.maxPressure *
          Math.exp(-daysLeft / config.decayRate)
      )
    );

    maxPressure = Math.max(maxPressure, pressure);
  });

  return maxPressure;
}
