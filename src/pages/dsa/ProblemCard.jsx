import React from "react";
import StatusBadge from "./StatusBadge";

function ProblemCard({ problem, onStatusChange }) {
  return (
    <li className="border rounded-md p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{problem.title}</p>
        <p className="text-sm text-muted-foreground">
          Topic: {problem.topic}
        </p>
        <StatusBadge status={problem.status} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStatusChange(problem.id, "solved")}
          className="text-xs px-2 py-1 border rounded"
        >
          Solved
        </button>
        <button
          onClick={() => onStatusChange(problem.id, "revising")}
          className="text-xs px-2 py-1 border rounded"
        >
          Revising
        </button>
        <button
          onClick={() => onStatusChange(problem.id, "weak")}
          className="text-xs px-2 py-1 border rounded"
        >
          Weak
        </button>
      </div>
    </li>
  );
}

export default React.memo(ProblemCard);
