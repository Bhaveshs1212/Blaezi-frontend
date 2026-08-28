import {
  BookOpen,
  Briefcase,
  Code2,
  Coffee,
  FolderKanban,
  ListTodo,
  Target,
} from "lucide-react";

const TYPE_META = {
  exam: { icon: BookOpen, label: "Exam", accent: "text-pink-600 bg-pink-50" },
  interview: { icon: Briefcase, label: "Interview", accent: "text-rose-600 bg-rose-50" },
  project: { icon: FolderKanban, label: "Project", accent: "text-indigo-600 bg-indigo-50" },
  dsa: { icon: Code2, label: "DSA", accent: "text-violet-600 bg-violet-50" },
  task: { icon: ListTodo, label: "Task", accent: "text-sky-600 bg-sky-50" },
  goal: { icon: Target, label: "Goal", accent: "text-amber-600 bg-amber-50" },
  break: { icon: Coffee, label: "Break", accent: "text-emerald-600 bg-emerald-50" },
};

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-gray-50 text-gray-600 border-gray-100",
};

function durationMinutes(startTime, endTime) {
  const [sh, sm] = String(startTime || "00:00").split(":").map(Number);
  const [eh, em] = String(endTime || "00:00").split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins > 0 ? mins : 0;
}

export default function AiPlanBlock({
  item,
  selectable = false,
  selected = false,
  onToggle,
}) {
  const meta = TYPE_META[item.type] || TYPE_META.task;
  const Icon = meta.icon;
  const mins = durationMinutes(item.startTime, item.endTime);
  const canSelect = selectable && item.type !== "break";

  return (
    <div className="relative pl-2">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-sm font-semibold text-gray-900 tabular-nums"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {item.startTime}
        </span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3">
          {canSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]"
              aria-label={`Select ${item.title}`}
            />
          )}

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.accent}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {meta.label}
              </span>
              {item.priority && (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {item.priority} priority
                </span>
              )}
            </div>

            <h3
              className="mt-2 text-base sm:text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {item.title}
            </h3>

            <p
              className="mt-1 text-sm text-gray-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {item.startTime} – {item.endTime}
              {mins > 0 ? ` · ${mins} min` : ""}
            </p>

            {item.reason && (
              <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Why?
                </p>
                <p
                  className="mt-1 text-sm text-gray-700 font-light"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {item.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
