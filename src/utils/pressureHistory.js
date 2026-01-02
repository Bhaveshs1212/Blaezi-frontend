const STORAGE_KEY = "blaezi_pressure_history";

export function savePressureSnapshot(profile) {
  const today = new Date().toISOString().split("T")[0];

  const snapshot = {
    date: today,
    pressures: profile.reduce((acc, p) => {
      acc[p.pillar] = p.pressure;
      return acc;
    }, {}),
  };

  const existing =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Avoid duplicate entry for same day
  const filtered = existing.filter(
    (s) => s.date !== today
  );

  filtered.push(snapshot);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
}

export function getPressureHistory() {
  return (
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  );
}
