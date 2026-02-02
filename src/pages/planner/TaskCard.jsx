import { usePlanner } from "../../context/PlannerContext";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, GripVertical } from "lucide-react";

export default function TaskCard({ task, isDragging = false }) {
  const { toggleTask, removeTask } = usePlanner();

  console.log('[TaskCard] Task:', task);

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(task.id);
    }
  };

  // Safely format date
  const formatDueDate = () => {
    if (!task.dueDate) return null;
    try {
      const date = task.dueDate instanceof Date 
        ? task.dueDate 
        : new Date(task.dueDate);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('[TaskCard] Error formatting date:', error);
      return null;
    }
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white
        transition-all duration-200
        ${isDragging ? 'shadow-lg scale-105' : 'hover:shadow-sm'}
        ${task.completed ? 'opacity-50' : ''}
      `}
    >
      {/* Drag Handle */}
      {!task.completed && (
        <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing" />
      )}

      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="cursor-pointer"
      />

      {/* Task Title */}
      <div className="flex-1">
        <p
          className={`
            text-sm font-medium
            ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}
          `}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {task.title || 'Untitled Task'}
        </p>
        {task.dueDate && formatDueDate() && (
          <p className="text-xs text-gray-400 mt-1">
            Due: {formatDueDate()}
          </p>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
