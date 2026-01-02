export function calculateBlaeziScore(pressureProfile) {
  if (!pressureProfile || pressureProfile.length === 0)
    return 100;

  const total = pressureProfile.reduce(
    (sum, p) => sum + p.pressure,
    0
  );

  const avg = total / pressureProfile.length;

  return Math.max(0, Math.round(100 - avg));
}
