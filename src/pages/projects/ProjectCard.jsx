import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { useProjects } from "../../context/ProjectContext";

export default function ProjectCard({ project }) {
  const { toggleMilestone } = useProjects();

  const total = project.milestones.length;
  const completed = project.milestones.filter(m => m.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const statusConfig = {
    "on-track": {
      label: "On track",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    "at-risk": {
      label: "Needs attention",
      className: "bg-purple-100 text-purple-700 border border-purple-200",
    },
    delayed: {
      label: "Delayed",
      className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    },
  };

  const status = statusConfig[project.health];

  return (
    <div className="rounded-xl bg-gradient-to-br from-white to-slate-50/30 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {project.description}
          </p>
        </div>

        {/* STATUS BADGE */}
        <Badge className={`${status.className} shrink-0`}>
          {status.label}
        </Badge>
      </div>

      {/* PROGRESS */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span className="font-semibold text-slate-700">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              progress >= 75 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
              progress >= 50 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
              progress >= 25 ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
              'bg-gradient-to-r from-violet-500 to-purple-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* MILESTONES */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        {project.milestones.map((milestone) => (
          <label
            key={milestone.id}
            className="flex items-center gap-3 text-sm cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={milestone.completed}
              onCheckedChange={(checked) =>
                toggleMilestone(
                  project.id,
                  milestone.id,
                  checked
                )
              }
            />
            <span
              className={
                milestone.completed
                  ? "line-through text-slate-400 transition-all"
                  : "text-slate-700"
              }
            >
              {milestone.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
