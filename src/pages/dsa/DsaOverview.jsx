import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDsa } from "../../context/DsaContext";
import { calculateDsaScore } from "../../utils/dsaScore";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { RefreshCw } from "lucide-react";

export default function DsaOverview() {
  const navigate = useNavigate();
  const { problems, refreshProblems } = useDsa();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage("");
    
    try {
      setMessage("🔄 Refreshing Striver SDE Sheet problems...");
      
      // Refresh problems list from backend
      if (refreshProblems) {
        await refreshProblems();
      }
      
      setMessage(`✅ Successfully refreshed ${problems.length} problems!`);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error('Refresh error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Refresh failed';
      setMessage(`❌ Error: ${errorMsg}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          DSA Practice
        </h1>
        <p className="text-lg text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Strengthen problem-solving through deliberate practice
        </p>
      </header>

      {/* Status Message */}
      {message && (
        <div className="bg-blue-50/50 border border-blue-100 text-blue-700 px-6 py-4 rounded-2xl text-sm font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {message}
        </div>
      )}

      {/* Refresh Button */}
      <Button 
        onClick={handleRefresh} 
        disabled={refreshing}
        className="gap-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-full px-6 py-3"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing...' : 'Refresh Problems'}
      </Button>

      {/* DSA Score */}
      <div className="rounded-3xl bg-[#6366F1] text-white p-12 shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          DSA Score
        </p>

        <div className="flex items-end gap-3 mb-6">
          <span className="text-7xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {dsaScore}
          </span>
          <span className="text-3xl mb-2 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/ 100</span>
        </div>

        <p className="text-base text-white/80 font-light max-w-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Indicates how prepared you are across problem types and confidence levels
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Solved" value={stats.solved} />
        <StatCard label="Revising" value={stats.revising} />
        <StatCard label="Weak" value={stats.weak} />
      </div>

      {/* View Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/dsa/topics")}
          className="rounded-3xl bg-white border border-gray-100 p-10 text-left hover:shadow-sm transition-shadow"
        >
          <h3 className="text-2xl font-semibold text-[#6366F1] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            View by Topics
          </h3>
          <p className="text-base text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Organize problems by data structure and algorithm type
          </p>
        </button>

        <button
          onClick={() => navigate("/dsa/problems")}
          className="rounded-3xl bg-white border border-gray-100 p-10 text-left hover:shadow-sm transition-shadow"
        >
          <h3 className="text-2xl font-semibold text-[#6366F1] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            All Problems
          </h3>
          <p className="text-base text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            View, search, and practice DSA problems
          </p>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-8">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </p>
      <span className="text-4xl font-bold text-[#6366F1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </span>
    </div>
  );
}
