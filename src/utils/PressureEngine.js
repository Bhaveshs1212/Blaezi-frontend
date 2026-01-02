export function buildPressureProfile({
  projectPressure,
  dsaPressure,
  careerPressure,
}) {
  return [
    {
      pillar: "projects",
      label: "Projects",
      pressure: projectPressure,
    },
    {
      pillar: "dsa",
      label: "DSA",
      pressure: dsaPressure,
    },
    {
      pillar: "career",
      label: "Career / Exams",
      pressure: careerPressure,
    },
  ];
}
