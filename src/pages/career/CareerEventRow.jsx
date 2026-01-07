import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { useCareer } from "../../context/CareerContext";
import { daysSince } from "../../utils/time";

export default function CareerEventRow({ event }) {
  const {
    toggleEvent,
    addPreparationStep,
    togglePreparationStep,
    deletePreparationStep,
    deleteEvent,
  } = useCareer();

  const [open, setOpen] = useState(false);
  const [newStep, setNewStep] = useState("");

  const days = -daysSince(event.date);

  const preparation = event.preparation || [];
  const totalSteps = preparation.length;
  const doneSteps = preparation.filter(
    (s) => s.done
  ).length;

  const progress =
    totalSteps === 0
      ? 0
      : Math.round((doneSteps / totalSteps) * 100);

  console.log('[CareerEventRow] Event:', event.title, 'Preparation:', preparation, 'Count:', preparation.length);

  return (
    <div>
      {/* ROW */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 transition cursor-pointer"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={event.completed}
            onCheckedChange={(checked) =>
              toggleEvent(event._id || event.id, checked)
            }
          />
        </div>

        <div className="flex-1">
          <p className="font-medium text-slate-800">
            {event.title}
          </p>
          <p className="text-xs text-slate-500">
            {doneSteps} / {totalSteps} steps done •{" "}
            {days > 0
              ? `${days} days left`
              : "Deadline passed"}
          </p>
        </div>

        <span className="text-xs text-slate-500">
          {progress}%
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Delete "${event.title}"? This action cannot be undone.`)) {
              deleteEvent(event._id || event.id);
            }
          }}
          className="px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
          title="Delete event"
        >
          Delete
        </button>

        <span className="text-slate-400">
          {open ? "▾" : "▸"}
        </span>
      </div>

      {/* EXPANDED */}
      {open && (
        <div className="px-10 py-4 bg-slate-50 space-y-4">
          {/* STEPS */}
          {preparation.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-3 text-sm"
            >
              <Checkbox
                checked={step.done}
                onCheckedChange={(checked) =>
                  togglePreparationStep(
                    event._id || event.id,
                    step._id || step.id,
                    checked
                  )
                }
              />
              <span
                className={
                  step.done
                    ? "line-through text-slate-400 flex-1"
                    : "text-slate-700 flex-1"
                }
              >
                {step.title}
              </span>
              <button
                onClick={() => {
                  if (window.confirm(`Delete step "${step.title}"?`)) {
                    deletePreparationStep(event._id || event.id, step._id || step.id);
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700"
                title="Delete step"
              >
                ✕
              </button>
            </div>
          ))}

          {/* ADD STEP */}
          <div className="flex gap-2 pt-2">
            <input
              value={newStep}
              onChange={(e) =>
                setNewStep(e.target.value)
              }
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (!newStep.trim()) return;
                  addPreparationStep(
                    event._id || event.id,
                    newStep
                  );
                  setNewStep("");
                }
              }}
              placeholder="Add preparation step"
              className="flex-1 text-sm px-3 py-2 border rounded-md"
            />
            <button
              onClick={() => {
                if (!newStep.trim()) return;
                addPreparationStep(
                  event._id || event.id,
                  newStep
                );
                setNewStep("");
              }}
              className="text-sm px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
