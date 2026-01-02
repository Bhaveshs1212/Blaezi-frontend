import { useMemo } from "react";
import { useProjects } from "../../context/ProjectContext";
import ProjectCard from "./ProjectCard";
import { daysSince } from "../../utils/time";

export default function Projects() {
  const { projects } = useProjects();

  // Calculate health for each project
  const projectsWithHealth = useMemo(() => {
    return projects.map((project) => {
      const total = project.milestones.length;
      const completed = project.milestones.filter(
        (m) => m.completed
      ).length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      const inactiveDays = daysSince(project.lastWorkedAt);

      const health =
        inactiveDays > 14 && progress < 90
          ? "delayed"
          : inactiveDays > 5 && progress < 60
          ? "at-risk"
          : "on-track";

      return { ...project, health, title: project.name };
    });
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Projects
        </h1>
        <p className="text-sm text-slate-600">
          Track execution and maintain momentum
        </p>
      </header>

      {/* OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          label="On Track"
          value={projectsWithHealth.filter(p => p.health === "on-track").length}
          color="text-emerald-600"
        />
        <OverviewCard
          label="At Risk"
          value={projectsWithHealth.filter(p => p.health === "at-risk").length}
          color="text-yellow-600"
        />
        <OverviewCard
          label="Delayed"
          value={projectsWithHealth.filter(p => p.health === "delayed").length}
          color="text-red-600"
        />
      </section>

      {/* PROJECT LIST */}
      <section className="space-y-6">
        {projectsWithHealth.length === 0 ? (
          <EmptyState />
        ) : (
          projectsWithHealth.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </section>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function OverviewCard({ label, value, color }) {
  const bgGradients = {
    "text-emerald-600": "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    "text-yellow-600": "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200",
    "text-red-600": "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
  };

  const textColors = {
    "text-emerald-600": "text-blue-600",
    "text-yellow-600": "text-purple-600",
    "text-red-600": "text-indigo-600"
  };

  return (
    <div className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 p-6 ${bgGradients[color] || "bg-white border-slate-200"}`}>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</p>
      <p className={`text-4xl font-bold mt-3 ${textColors[color] || color}`}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100/50 p-12 text-center">
      <div className="inline-block p-3 rounded-full bg-indigo-100/50 mb-3">
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-slate-600 text-sm font-medium">
        No projects yet
      </p>
      <p className="text-slate-500 text-xs mt-1">
        Add your first project to start tracking progress
      </p>
    </div>
  );
}
