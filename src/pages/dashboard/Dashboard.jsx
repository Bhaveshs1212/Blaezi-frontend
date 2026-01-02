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

  // Redirect to landing page if user directly accesses or refreshes dashboard
  useEffect(() => {
    const hasVisitedLanding = sessionStorage.getItem("visited_landing");
    if (!hasVisitedLanding) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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

    projects.forEach((p) => {
      if (p.health === "delayed") delayed++;
      if (p.health === "at-risk") atRisk++;
    });

    return normalizePressure(delayed * 40 + atRisk * 20);
  }, [projects]);

  const dsaPressure = useMemo(
    () => normalizePressure((100 - dsaScore) * 0.6),
    [dsaScore]
  );

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

  const trend = getPressureTrend(
    getPressureHistory(),
    "overall"
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-12">
      {/* PAGE HEADER */}
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">
          Today
        </h1>
        <p className="text-slate-600 mt-1">
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
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
        <p className="text-sm text-slate-600">
          Overall Momentum
        </p>

        <div className="flex items-center gap-6 mt-4">
          <span className="text-6xl font-semibold text-indigo-600">
            {blaeziScore}
          </span>

          <div>
            <p className="text-slate-700 font-medium">
              Balanced but improvable
            </p>
            <p className="text-sm text-slate-600 max-w-md">
              Consistency across projects and DSA will steadily
              raise your momentum.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Trend:{" "}
              {trend === "up"
                ? "Improving"
                : trend === "down"
                ? "Declining"
                : "Stable"}
            </p>
          </div>
        </div>
      </section>

      {/* PRESSURE DETAILS */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <PressureBar
          label="Projects"
          value={projectsPressure}
          color="bg-emerald-500"
        />

        <PressureBar
          label="DSA"
          value={dsaPressure}
          color="bg-blue-500"
        />

        <PressureBar
          label="Career / Exams"
          value={careerPressure}
          color="bg-purple-500"
        />
      </section>

      {/* WEEKLY SUMMARY */}
      <section className="rounded-2xl bg-slate-100 p-6">
        <p className="text-sm font-medium text-slate-700">
          This week so far
        </p>
        <p className="text-sm text-slate-600 mt-2">
          {weeklySummary.message}
        </p>
      </section>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatusCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-lg font-semibold text-slate-800 mt-1">
        {value}
      </p>
    </div>
  );
}
