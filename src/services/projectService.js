export async function fetchProjects() {
  return [
    {
      id: 1,
      name: "Portfolio Website",
      description: "Personal portfolio built with React and Tailwind",
      milestones: [
        { id: 1, title: "Design UI", completed: true },
        { id: 2, title: "Build Components", completed: false },
        { id: 3, title: "Deploy Website", completed: false },
      ],
      lastWorkedAt: "2025-09-25T10:00:00Z",
    },
    {
      id: 2,
      name: "E-commerce Platform",
      description: "Full-stack e-commerce application",
      milestones: [
        { id: 1, title: "Setup Backend", completed: true },
        { id: 2, title: "Frontend UI", completed: false },
      ],
      lastWorkedAt: "2024-09-10T12:00:00Z",
    },
  ];
}
