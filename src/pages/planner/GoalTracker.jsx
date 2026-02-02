import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanner } from "../../context/PlannerContext";
import GoalCard from "./GoalCard";
import { Plus } from "lucide-react";

export default function GoalTracker() {
  const { goals, addGoal } = usePlanner();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", deadline: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.deadline) {
      await addGoal({
        name: formData.name,
        deadline: new Date(formData.deadline),
      });
      setFormData({ name: "", deadline: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Goals & Projects
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
          aria-label="Add goal"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-2xl"
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Goal name..."
              className="w-full px-4 py-2 mb-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              autoFocus
            />
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 mb-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-xl transition"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GoalCard goal={goal} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {goals.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No goals yet. Click + to add one!
          </p>
        </div>
      )}
    </div>
  );
}
