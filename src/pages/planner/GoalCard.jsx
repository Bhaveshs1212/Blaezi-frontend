import { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Progress } from "../../components/ui/progress";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Calendar as CalendarIcon, Plus, X } from "lucide-react";

export default function GoalCard({ goal }) {
  const { tasks, removeGoal, updateGoalDetails } = usePlanner();
  const [showStepInput, setShowStepInput] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');

  console.log('[GoalCard] Goal:', goal);

  const steps = goal.steps || [];

  // Calculate progress based on steps
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = steps.length > 0 
    ? Math.round((completedSteps / steps.length) * 100) 
    : 0;

  const handleAddStep = async () => {
    if (newStepTitle.trim()) {
      const updatedSteps = [...steps, {
        id: `step-${Date.now()}`,
        title: newStepTitle,
        completed: false
      }];
      await updateGoalDetails(goal.id, { steps: updatedSteps });
      setNewStepTitle('');
      setShowStepInput(false);
    }
  };

  const handleToggleStep = async (stepId) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    await updateGoalDetails(goal.id, { steps: updatedSteps });
  };

  const handleDeleteStep = async (stepId) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    await updateGoalDetails(goal.id, { steps: updatedSteps });
  };

  // Calculate days remaining - ensure deadline is a Date object
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadline = goal.deadline instanceof Date 
    ? goal.deadline 
    : new Date(goal.deadline);
  deadline.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  console.log('[GoalCard] Days calculation:', { 
    today: today.toISOString(), 
    deadline: deadline.toISOString(), 
    daysRemaining 
  });
  
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 7;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      removeGoal(goal.id);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 
            className="text-sm font-semibold text-gray-900 mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {goal.name}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <CalendarIcon className="w-3 h-3 text-gray-400" />
            <span
              className={`
                ${isOverdue ? 'text-red-600 font-medium' : ''}
                ${isUrgent ? 'text-amber-600 font-medium' : 'text-gray-500'}
              `}
            >
              {isOverdue 
                ? `Overdue by ${Math.abs(daysRemaining)} days`
                : `${daysRemaining} days remaining`
              }
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
          aria-label="Delete goal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {steps.length > 0 && (
          <p className="text-xs text-gray-400">
            {completedSteps} of {steps.length} steps completed
          </p>
        )}
      </div>

      {/* Steps List */}
      {steps.length > 0 && (
        <div className="mt-3 space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2 text-xs group">
              <Checkbox
                checked={step.completed}
                onCheckedChange={() => handleToggleStep(step.id)}
                className="h-3 w-3"
              />
              <span className={`flex-1 ${step.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {step.title}
              </span>
              <button
                onClick={() => handleDeleteStep(step.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Step */}
      {showStepInput ? (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
            placeholder="Step title..."
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={handleAddStep}
            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
          >
            Add
          </button>
          <button
            onClick={() => { setShowStepInput(false); setNewStepTitle(''); }}
            className="px-2 py-1 text-gray-600 text-xs rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowStepInput(true)}
          className="mt-3 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-3 h-3" />
          Add Step
        </button>
      )}
    </div>
  );
}
