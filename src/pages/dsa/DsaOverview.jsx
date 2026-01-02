import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDsa } from "../../context/DsaContext";
import { calculateDsaScore } from "../../utils/dsaScore";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function DsaOverview() {
  const navigate = useNavigate();
  const { problems } = useDsa();

  const dsaScore = useMemo(
    () => calculateDsaScore(problems),
    [problems]
  );

  const stats = useMemo(() => {
    let solved = 0;
    let revising = 0;
    let weak = 0;

    problems.forEach((p) => {
      if (p.status === "solved") solved++;
      if (p.status === "revising") revising++;
      if (p.status === "weak") weak++;
    });

    return { solved, revising, weak, total: problems.length };
  }, [problems]);

  return (
    <div className="space-y-6">
<h1 className="text-2xl font-bold">DSA Forge</h1>
<p className="text-sm text-muted-foreground">
  Strengthen problem-solving through deliberate practice
</p>
<Breadcrumbs
  items={[
    { label: "Dashboard", href: "/" },
    { label: "DSA" },
  ]}
/>
{problems.length === 0 && (
  <p className="text-sm text-muted-foreground">
    Start practicing DSA problems. Add problems and mark your confidence. Consistency beats intensity.
  </p>
)}


      {/* DSA Score */}
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <CardHeader>
          <CardTitle className="text-sm opacity-90">
            DSA Forge Score
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold">
              {dsaScore}
            </span>
            <span className="text-xl mb-1">/ 100</span>
          </div>

          <p className="text-sm opacity-90 mt-2">
Indicates how prepared you are across problem types and confidence levels
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Solved" value={stats.solved} />
        <StatCard label="Revising" value={stats.revising} />
        <StatCard label="Weak" value={stats.weak} />
      </div>

      {/* CTA */}
      <Card
        onClick={() => navigate("/dsa/problems")}
        className="cursor-pointer hover:shadow-md transition"
      >
        <CardHeader>
          <CardTitle>Go to Problems →</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View, search, and practice DSA problems
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-bold">
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
