import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { useCareer } from "../../context/CareerContext";
import { daysUntil } from "../../utils/time";

export default function CareerEventRow({ event }) {
  const {
    toggleEvent,
    addPreparationStep,
    togglePreparationStep,
  } = useCareer();

  const [open, setOpen] = useState(false);
  const [newStep, setNewStep] = useState("");

  const days = daysUntil(event.date);

  const totalSteps = event.preparation.length;
  const doneSteps = event.preparation.filter(
    (s) => s.done
  ).length;

  const progress =
    totalSteps === 0
      ? 0
      : Math.round((doneSteps / totalSteps) * 100);

  return (
    <div>
      {/* ROW */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 transition"
      >
        <Checkbox
          checked={event.completed}
          onCheckedChange={(checked) =>
            toggleEvent(event.id, checked)
          }
        />

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

        <span className="text-slate-400">
          {open ? "▾" : "▸"}
        </span>
      </button>

      {/* EXPANDED */}
      {open && (
        <div className="px-10 py-4 bg-slate-50 space-y-4">
          {/* STEPS */}
          {event.preparation.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-3 text-sm"
            >
              <Checkbox
                checked={step.done}
                onCheckedChange={(checked) =>
                  togglePreparationStep(
                    event.id,
                    step.id,
                    checked
                  )
                }
              />
              <span
                className={
                  step.done
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }
              >
                {step.title}
              </span>
            </div>
          ))}

          {/* ADD STEP */}
          <div className="flex gap-2 pt-2">
            <input
              value={newStep}
              onChange={(e) =>
                setNewStep(e.target.value)
              }
              placeholder="Add preparation step"
              className="flex-1 text-sm px-3 py-2 border rounded-md"
            />
            <button
              onClick={() => {
                if (!newStep.trim()) return;
                addPreparationStep(
                  event.id,
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
