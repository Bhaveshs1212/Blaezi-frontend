import { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Calendar as CalendarIcon, Trash2, Plus, Edit2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const { events, addEvent, updateEventDetails, removeEvent } = usePlanner();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", date: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    if (editingId) {
      await updateEventDetails(editingId, {
        title: formData.title,
        date: new Date(formData.date),
        description: formData.description,
      });
      setEditingId(null);
    } else {
      await addEvent({
        title: formData.title,
        date: new Date(formData.date),
        description: formData.description,
      });
      setShowAddForm(false);
    }
    
    setFormData({ title: "", date: "", description: "" });
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      description: event.description || "",
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ title: "", date: "", description: "" });
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateA - dateB;
  });

  const formatDate = (date) => {
    if (!date) return "No date";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Important Events
        </h2>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-6 p-5 bg-gray-50 rounded-2xl space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              required
            />
          </div>
          <div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              rows="2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-300 transition"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-5 rounded-2xl border-2 transition ${
                editingId === event.id
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 
                    className="text-base font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  {event.description && (
                    <p 
                      className="text-sm text-gray-600 mt-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedEvents.length === 0 && !showAddForm && !editingId && (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p 
            className="text-gray-400 text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            No events scheduled. Add one to track important dates!
          </p>
        </div>
      )}
    </div>
  );
}
