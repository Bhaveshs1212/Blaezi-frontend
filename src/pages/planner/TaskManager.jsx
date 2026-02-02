import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanner } from "../../context/PlannerContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Archive, Plus } from "lucide-react";

export default function TaskManager() {
  const { activeTasks, completedTasks, reorderTasks, archiveCompletedTasks, addTask } = usePlanner();
  const [quickAddValue, setQuickAddValue] = useState("");

  const handleQuickAdd = async (e) => {
    if (e.key === 'Enter' && quickAddValue.trim()) {
      await addTask({
        title: quickAddValue,
        completed: false,
        dueDate: new Date(), // Default to today
      });
      setQuickAddValue("");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(activeTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order field
    const reordered = items.map((task, index) => ({ ...task, order: index }));
    reorderTasks(reordered);
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
      {/* Quick Add Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            onKeyDown={handleQuickAdd}
            placeholder="Quick add a task... (Press Enter)"
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Task Manager
        </h2>
        {completedTasks.length > 0 && (
          <button
            onClick={archiveCompletedTasks}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Archive className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Tasks with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="active-tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 mb-8"
            >
              <AnimatePresence>
                {activeTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard task={task} isDragging={snapshot.isDragging} />
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {activeTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No active tasks. Add one above to get started!
          </p>
        </div>
      )}

      {/* Recently Completed Section */}
      {completedTasks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 
            className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Recently Done
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
