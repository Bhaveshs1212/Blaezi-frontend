import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useProjects } from "../../context/ProjectContext";
import { useDsa } from "../../context/DsaContext";
import { useCareer } from "../../context/CareerContext";

import PressureBar from "../../components/common/PressureBar";

import { calculateCareerPressure } from "../../utils/CareerPressure";
import { calculateDsaScore } from "../../utils/dsaScore";
import { normalizePressure } from "../../utils/Pressure";
import { buildPressureProfile } from "../../utils/PressureEngine";
import { getFocusRecommendation } from "../../utils/focusEngine";
import { calculateBlaeziScore } from "../../utils/blaeziScore";
import {
  savePressureSnapshot,
  getPressureHistory,
} from "../../utils/pressureHistory";
import { getPressureTrend } from "../../utils/pressureTrend";
import { buildWeeklySummary } from "../../utils/weeklySummary";

export default function Dashboard() {
  const navigate = useNavigate();

  const { projects } = useProjects();
  const { problems } = useDsa();
  const { events } = useCareer();

  /* ---------------- DERIVED VALUES ---------------- */

  const dsaScore = useMemo(
    () => calculateDsaScore(problems),
    [problems]
  );

  const careerPressure = useMemo(
    () => calculateCareerPressure(events),
    [events]
  );

  const projectsPressure = useMemo(() => {
    let delayed = 0;
    let atRisk = 0;
    let completed = 0;

    projects.forEach((p) => {
      // If project has explicit status from backend
      if (p.status === 'completed') {
        completed++;
        return;
      }
      
      // Use healthStatus from backend, or calculate health based on activity
      let health = p.healthStatus || p.health;
      
      // If no health status, calculate based on lastWorkedAt
      if (!health && p.lastWorkedAt) {
        const daysSinceWork = Math.floor(
          (Date.now() - new Date(p.lastWorkedAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceWork > 14) {
          health = "delayed";
        } else if (daysSinceWork > 7) {
          health = "at-risk";
        } else {
          health = "on-track";
        }
      }
      
      if (health === "delayed") delayed++;
      else if (health === "at-risk") atRisk++;
    });

    const activeProjects = projects.length - completed;
    console.log('Project pressure calculation:', { 
      total: projects.length, 
      active: activeProjects,
      completed,
      delayed, 
      atRisk,
      pressure: delayed * 40 + atRisk * 20
    });
    
    // If no active projects, no pressure
    if (activeProjects === 0) return 0;
    
    return normalizePressure(delayed * 40 + atRisk * 20);
  }, [projects]);

  const dsaPressure = useMemo(() => {
    // Higher multiplier for low scores to prioritize getting started
    // When dsaScore is 0-20%, pressure should be critical (80-100)
    // When dsaScore is 20-50%, pressure should be high (50-80)
    // When dsaScore is 50-80%, pressure should be moderate (20-50)
    const rawPressure = (100 - dsaScore);
    return normalizePressure(rawPressure);
  }, [dsaScore]);

  const pressureProfile = useMemo(
    () =>
      buildPressureProfile({
        projectPressure: projectsPressure,
        dsaPressure,
        careerPressure,
      }),
    [projectsPressure, dsaPressure, careerPressure]
  );

  useEffect(() => {
    if (pressureProfile.length > 0) {
      savePressureSnapshot(pressureProfile);
    }
  }, [pressureProfile]);

  const focus = useMemo(
    () => getFocusRecommendation(pressureProfile),
    [pressureProfile]
  );

  const weeklySummary = useMemo(
    () =>
      buildWeeklySummary({
        problems,
        projects,
        careerEvents: events,
      }),
    [problems, projects, events]
  );

  const blaeziScore = useMemo(
    () => calculateBlaeziScore(pressureProfile),
    [pressureProfile]
  );

  const trend = useMemo(() => {
    const history = getPressureHistory();
    if (!history || history.length < 2) return "stable";
    
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    
    // Calculate overall pressure as average
    const getOverallPressure = (snapshot) => {
      const pressures = snapshot.pressures;
      const values = Object.values(pressures).filter(v => typeof v === 'number');
      if (values.length === 0) return 0;
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    };
    
    const lastOverall = getOverallPressure(last);
    const prevOverall = getOverallPressure(prev);
    const diff = lastOverall - prevOverall;
    
    if (diff > 5) return "up";
    if (diff < -5) return "down";
    return "stable";
  }, [projectsPressure, dsaPressure, careerPressure]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-12">
      {/* PAGE HEADER */}
      <header>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Today
        </h1>
        <p className="text-lg text-gray-500 font-light mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your current focus and overall momentum
        </p>
      </header>

      {/* FOCUS HERO */}
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 shadow-lg">
        <p className="text-sm uppercase tracking-wide opacity-80">
          Today’s Focus
        </p>

        <h2 className="text-2xl font-semibold mt-2">
          {focus.title}
        </h2>

        <p className="text-sm opacity-90 mt-3 max-w-2xl">
          {focus.message}
        </p>

        <button
          onClick={() => navigate(`/${focus.action}`)}
          className="mt-6 inline-flex items-center rounded-lg bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-medium transition"
        >
          Go to {focus.action} →
        </button>
      </section>

      {/* STATUS OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Projects"
          value={
            projectsPressure < 30
              ? "Stable"
              : projectsPressure < 60
              ? "Needs attention"
              : "Critical"
          }
        />

        <StatusCard
          title="DSA Practice"
          value={
            dsaPressure < 30
              ? "On track"
              : dsaPressure < 60
              ? "Lagging"
              : "Weak"
          }
        />

        <StatusCard
          title="Career"
          value={
            careerPressure < 40
              ? "Clear"
              : careerPressure < 70
              ? "Upcoming"
              : "Urgent"
          }
        />
      </section>

      {/* MOMENTUM */}
      <section className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Overall Momentum
        </p>

        <div className="flex items-center gap-8 mt-2">
          <span className="text-7xl font-bold text-[#6366F1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {blaeziScore}
          </span>

          <div>
            <p className="text-gray-900 font-semibold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Balanced but improvable
            </p>
            <p className="text-base text-gray-600 font-light max-w-md mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Consistency across projects and DSA will steadily
              raise your momentum.
            </p>
            <p className="text-sm text-gray-500 mt-3 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Trend:{" "}
              {trend === "up"
                ? "Improving ↑"
                : trend === "down"
                ? "Declining ↓"
                : "Stable →"}
            </p>
          </div>
        </div>
      </section>

      {/* PRESSURE DETAILS */}
      <section className="rounded-3xl bg-white border border-gray-100 p-10 space-y-6 shadow-sm">
        <PressureBar
          label="Projects"
          value={projectsPressure}
          color="bg-[#6366F1]"
        />

        <PressureBar
          label="DSA"
          value={dsaPressure}
          color="bg-[#8B5CF6]"
        />

        <PressureBar
          label="Career / Exams"
          value={careerPressure}
          color="bg-[#EC4899]"
        />
      </section>

      {/* WEEKLY SUMMARY */}
      <section className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          This week so far
        </p>
        <p className="text-base text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {weeklySummary.message}
        </p>
      </section>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatusCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
      <p className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</p>
      <p className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </p>
    </div>
  );
}
