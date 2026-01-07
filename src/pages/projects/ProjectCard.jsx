import { useState, useEffect, useRef } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { useProjects } from "../../context/ProjectContext";
import { MoreVertical } from "lucide-react";

export default function ProjectCard({ project }) {
  const { toggleMilestone, updateProjectStatus } = useProjects();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const total = project.milestones.length;
  const completed = project.milestones.filter(m => m.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const statusConfig = {
    "on-track": {
      label: "On track",
      className: "bg-green-50 text-green-700 border border-green-100 rounded-full px-4 py-1.5 text-xs font-medium",
    },
    "at-risk": {
      label: "At risk",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full px-4 py-1.5 text-xs font-medium",
    },
    delayed: {
      label: "Delayed",
      className: "bg-red-50 text-red-700 border border-red-100 rounded-full px-4 py-1.5 text-xs font-medium",
    },
    completed: {
      label: "✓ Completed",
      className: "bg-[#6366F1] text-white border border-[#6366F1] rounded-full px-4 py-1.5 text-xs font-medium",
    },
  };

  const status = statusConfig[project.health];

  return (
    <div className="rounded-3xl bg-white border border-gray-100 hover:shadow-sm transition-shadow p-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {project.title}
          </h3>
          <p className="text-base text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* STATUS BADGE */}
          <span className={status.className} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {status.label}
          </span>
          
          {/* MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl shadow-sm py-2 z-10 min-w-[180px]">
                <button
                  onClick={() => {
                    updateProjectStatus(project.id || project._id, 'active');
                    setMenuOpen(false);
                  }}
                  className="w-full px-5 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-medium text-gray-700"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Mark as Active
                </button>
                <button
                  onClick={() => {
                    updateProjectStatus(project.id || project._id, 'completed');
                    setMenuOpen(false);
                  }}
                  className="w-full px-5 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-medium text-[#6366F1]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  ✓ Mark as Completed
                </button>
              </div>
            )}
          </div>
        </div>
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
