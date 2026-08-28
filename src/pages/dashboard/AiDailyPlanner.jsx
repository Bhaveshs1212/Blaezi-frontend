import { useMemo, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { generateDailyPlan } from "../../services/puterPlanner";
import { usePlanner } from "../../context/PlannerContext";
import AiPlanBlock from "./AiPlanBlock";

const FOCUS_OPTIONS = [
  { value: "balanced", label: "Balanced" },
  { value: "exams", label: "Focus on exams" },
  { value: "dsa", label: "Focus on DSA" },
  { value: "projects", label: "Focus on projects" },
  { value: "tasks", label: "Focus on tasks" },
];

export default function AiDailyPlanner() {
  const { addTask } = usePlanner();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableHours, setAvailableHours] = useState(5);
  const [focus, setFocus] = useState("balanced");
  const [selected, setSelected] = useState({});
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState(null);

  const schedule = plan?.schedule || [];

  const selectableItems = useMemo(
    () => schedule.filter((item) => item.type !== "break"),
    [schedule]
  );

  const selectedCount = useMemo(
    () => selectableItems.filter((_, index) => selected[index]).length,
    [selectableItems, selected]
  );

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAddMessage(null);
    setSelected({});

    try {
      const hours = Number(availableHours);
      const availableMinutes =
        Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : undefined;

      const data = await generateDailyPlan({
        availableMinutes,
        focus,
      });

      setPlan(data);
    } catch (err) {
      console.error("[AiDailyPlanner] generate failed:", err);
      console.error("[AiDailyPlanner] response data:", err?.response?.data);
      const apiMessage = err?.response?.data?.message;
      const apiCode = err?.response?.data?.code || err?.code;
      let message =
        apiMessage ||
        err?.message ||
        "We couldn't generate your plan right now. Please try again.";
      if (apiCode === "AI_NOT_CONFIGURED") {
        message =
          "AI_API_KEY is not configured on the backend. Add it to Blaezi-backend/.env and restart the server.";
      } else if (apiCode === "AI_AUTH_FAILED") {
        message =
          "OpenAI rejected the API key. Check AI_API_KEY in Blaezi-backend/.env and restart the server.";
      } else if (apiCode === "PUTER_AUTH") {
        message = "Sign in to Puter to generate a plan.";
      } else if (apiCode === "PUTER_LIMIT") {
        message = "Puter usage limit reached. Check your Puter account allowance.";
      } else if (apiCode === "PUTER_MISSING") {
        message = "Puter.js failed to load. Refresh the page and try again.";
      }
      setError(message);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index) => {
    setSelected((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddSelected = async () => {
    const itemsToAdd = selectableItems.filter((_, index) => selected[index]);
    if (itemsToAdd.length === 0) return;

    setAdding(true);
    setAddMessage(null);
    try {
      for (const item of itemsToAdd) {
        await addTask({
          title: item.title,
          completed: false,
          dueDate: plan?.date || null,
        });
      }
      setAddMessage(`Added ${itemsToAdd.length} task${itemsToAdd.length === 1 ? "" : "s"} to your planner.`);
      setSelected({});
    } catch (err) {
      console.error("[AiDailyPlanner] add selected failed:", err);
      setAddMessage("Some tasks could not be added. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="rounded-2xl sm:rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#6366F1]" />
            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              AI Daily Planner
            </h2>
          </div>
          <p
            className="mt-2 text-sm sm:text-base text-gray-500 font-light"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Your personalized plan for today — powered by Puter.js (sign-in may be required)
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : plan ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Today&apos;s Plan
            </>
          )}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span
            className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Available time (hours)
          </span>
          <input
            type="number"
            min={0.5}
            max={16}
            step={0.5}
            value={availableHours}
            onChange={(e) => setAvailableHours(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
        </label>

        <label className="block">
          <span
            className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Focus
          </span>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#6366F1]" />
          <p
            className="mt-3 text-sm font-medium text-gray-800"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Loading...
          </p>
          <p
            className="mt-1 text-sm text-gray-600 font-light"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Analyzing your tasks, deadlines and progress...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-center">
          <p
            className="text-sm font-semibold text-red-700"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            We couldn&apos;t generate your plan right now.
          </p>
          <p
            className="mt-1 text-sm text-red-600/90 font-light"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {error}
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-4 text-sm font-semibold text-[#6366F1] hover:underline"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Please try again
          </button>
        </div>
      )}

      {!loading && !error && plan?.insufficientData && (
        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-6 text-center">
          <p
            className="text-sm font-semibold text-amber-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            You don&apos;t have enough scheduled activities yet.
          </p>
          <p
            className="mt-2 text-sm text-amber-800/90 font-light"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Add a few tasks or deadlines and I&apos;ll build a personalized plan.
          </p>
        </div>
      )}

      {!loading && !error && plan && !plan.insufficientData && (
        <div className="mt-8 space-y-6">
          {plan.summary && (
            <p
              className="text-sm sm:text-base text-gray-700 font-light"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {plan.summary}
            </p>
          )}

          {typeof plan.totalPlannedMinutes === "number" && (
            <p
              className="text-xs font-medium text-gray-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Planned · {plan.totalPlannedMinutes} minutes
            </p>
          )}

          <div className="space-y-5">
            {schedule.map((item, index) => {
              const selectableIndex = selectableItems.indexOf(item);
              return (
                <AiPlanBlock
                  key={`${item.startTime}-${item.title}-${index}`}
                  item={item}
                  selectable={item.type !== "break"}
                  selected={selectableIndex >= 0 ? !!selected[selectableIndex] : false}
                  onToggle={() => selectableIndex >= 0 && toggleItem(selectableIndex)}
                />
              );
            })}
          </div>

          {selectableItems.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddSelected}
                disabled={adding || selectedCount === 0}
                className="inline-flex items-center justify-center rounded-xl border border-[#6366F1] text-[#6366F1] hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold transition"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {adding ? "Adding..." : `Add Selected Tasks${selectedCount ? ` (${selectedCount})` : ""}`}
              </button>
              {addMessage && (
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {addMessage}
                </p>
              )}
            </div>
          )}

          {(plan.insights?.length > 0 || plan.warnings?.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {plan.insights?.length > 0 && (
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p
                    className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Insights
                  </p>
                  <ul className="space-y-2">
                    {plan.insights.map((insight, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 font-light"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.warnings?.length > 0 && (
                <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-4">
                  <p
                    className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Warnings
                  </p>
                  <ul className="space-y-2">
                    {plan.warnings.map((warning, i) => (
                      <li
                        key={i}
                        className="text-sm text-amber-900/90 font-light"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
