import React from "react";

function DsaSummary({ score, insight }) {
  return (
    <div className="border rounded-md p-4 space-y-2">
      <p className="text-sm text-muted-foreground">
        DSA Health Score
      </p>

      <p className="text-3xl font-bold">{score}%</p>

      <p className="text-sm">{insight}</p>
    </div>
  );
}

export default React.memo(DsaSummary);
