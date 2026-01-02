import { daysSince } from "./time";

export function buildWeeklySummary({
  problems,
  projects,
  careerEvents,
}) {
  const solvedThisWeek = problems.filter(
    (p) =>
      p.status === "solved" &&
      p.lastSolvedAt &&
      daysSince(p.lastSolvedAt) <= 7
  ).length;

  const workedProjects = projects.filter(
    (p) =>
      p.lastWorkedAt &&
      daysSince(p.lastWorkedAt) <= 7
  ).length;

  const upcomingCareer = careerEvents.filter(
    (e) => daysSince(e.date) <= 7
  ).length;

  if (
    solvedThisWeek === 0 &&
    workedProjects === 0 &&
    upcomingCareer === 0
  ) {
    return {
      title: "Quiet Week",
      message:
"This week was relatively quiet. A small restart plan can help regain momentum.",
      tone: "neutral",
    };
  }

  return {
    title: "Weekly Progress Summary",
    message: `You solved ${solvedThisWeek} DSA problems, worked on ${workedProjects} project(s), and have ${upcomingCareer} upcoming career item(s).`,
    tone:
      solvedThisWeek + workedProjects >= 5
        ? "positive"
        : "warning",
  };
}
