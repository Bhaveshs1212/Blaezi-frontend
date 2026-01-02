export function daysSince(date) {
  const now = new Date();
  const past = new Date(date);
  return Math.floor(
    (now - past) / (1000 * 60 * 60 * 24)
  );
}
