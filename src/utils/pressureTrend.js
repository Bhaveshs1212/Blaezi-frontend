export function getPressureTrend(history, pillar) {
  if (!history || history.length < 2) {
    return "stable";
  }

  const last = history[history.length - 1];
  const prev = history[history.length - 2];

  const diff =
    last.pressures[pillar] -
    prev.pressures[pillar];

  if (diff > 5) return "up";
  if (diff < -5) return "down";
  return "stable";
}
