export const dsaProblems = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  title: `Problem ${i + 1}`,
  difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
  topic: "Arrays",
  status: "none", // 👈 NEW FIELD
}));
