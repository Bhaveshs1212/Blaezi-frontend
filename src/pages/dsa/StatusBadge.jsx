export default function StatusBadge({ status }) {
  if (status === "solved")
    return <span className="text-green-600">Solved</span>;

  if (status === "revising")
    return <span className="text-yellow-600">Revising</span>;

  if (status === "weak")
    return <span className="text-red-600">Weak</span>;

  return <span className="text-muted-foreground">Not Started</span>;
}
