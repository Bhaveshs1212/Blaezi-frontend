import { daysSince } from "./time";

export function calculateDsaScore(problems) {
  if (problems.length === 0) return 0;

  let points = 0;

  problems.forEach((p) => {
    if (p.status === "solved") points += 1;
    if (p.status === "revising") points += 0.5;

    if (p.lastSolvedAt && daysSince(p.lastSolvedAt) > 7) {
      points -= 0.25; // decay
    }
  });

  const max = problems.length;
  const normalized = Math.max(0, points / max);

  return Math.round(normalized * 100);
}
