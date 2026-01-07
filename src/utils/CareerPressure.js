import { daysSince } from "./time";

/**
 * Career Pressure Calculation
 * ----------------------------
 * Pressure increases as deadlines approach
 * Pressure decreases as preparation progresses
 */
export function calculateCareerPressure(events) {
  if (!events || events.length === 0) return 0;

  let maxPressure = 0;

  events.forEach((event) => {
    if (event.completed) return;

    const daysLeft = daysSince(event.date);

    // --------------------
    // STEP 1: Time urgency
    // --------------------
    let timeUrgency = 0;

    if (daysLeft <= 0) {
      timeUrgency = 100;
    } else if (daysLeft <= 7) {
      timeUrgency = 90;
    } else if (daysLeft <= 14) {
      timeUrgency = 75;
    } else if (daysLeft <= 30) {
      timeUrgency = 50;
    } else if (daysLeft <= 60) {
      timeUrgency = 30;
    } else {
      timeUrgency = 15;
    }

    // --------------------------------
    // STEP 2: Preparation completeness
    // --------------------------------
    let prepFactor = 1;

    if (
      event.preparation &&
      event.preparation.length > 0
    ) {
      const total = event.preparation.length;
      const done = event.preparation.filter(
        (s) => s.done
      ).length;

      const prepProgress = done / total;

      prepFactor = 1 - prepProgress;
    }

    // --------------------------------
    // STEP 3: Final pressure
    // --------------------------------
    const eventPressure = Math.round(
      timeUrgency * prepFactor
    );

    maxPressure = Math.max(
      maxPressure,
      eventPressure
    );
  });

  return maxPressure;
}
