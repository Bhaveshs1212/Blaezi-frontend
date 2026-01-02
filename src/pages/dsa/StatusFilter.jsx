import React from "react";

const STATUSES = ["all", "solved", "revising", "weak"];

function StatusFilter({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`border px-3 py-1 rounded text-sm ${
            value === status ? "bg-black text-white" : ""
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default React.memo(StatusFilter);
