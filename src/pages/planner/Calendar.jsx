import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { usePlanner } from "../../context/PlannerContext";
import { X } from "lucide-react";
import "./Calendar.css";

export default function Calendar() {
  const { goals, events, addGoal } = usePlanner();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ name: '', deadline: '' });

  console.log('[Calendar] goals:', goals);
  console.log('[Calendar] events:', events);

  // Convert goals and events to calendar entries
  const calendarEvents = useMemo(() => {
    const allEvents = [];
    
    // Add goals
    goals.forEach(goal => {
      if (goal.deadline) {
        const deadline = goal.deadline instanceof Date 
          ? goal.deadline 
          : new Date(goal.deadline);
        
        allEvents.push({
          id: `goal-${goal.id}`,
          title: `📌 ${goal.name || 'Untitled Goal'}`,
          date: deadline.toISOString().split('T')[0],
          backgroundColor: '#8B5CF6',
          borderColor: 'transparent',
          textColor: '#FFFFFF',
        });
      }
    });
    
    // Add events
    events.forEach(event => {
      if (event.date) {
        const eventDate = event.date instanceof Date 
          ? event.date 
          : new Date(event.date);
        
        allEvents.push({
          id: `event-${event.id}`,
          title: `🎯 ${event.title || 'Untitled Event'}`,
          date: eventDate.toISOString().split('T')[0],
          backgroundColor: '#10B981',
          borderColor: 'transparent',
          textColor: '#FFFFFF',
        });
      }
    });
    
    console.log('[Calendar] Generated calendar events:', allEvents);
    return allEvents;
  }, [goals, events]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEventForm({ name: '', deadline: info.dateStr });
    setShowEventForm(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (eventForm.name.trim()) {
      await addGoal({
        name: eventForm.name,
        deadline: new Date(eventForm.deadline),
        steps: []
      });
      setShowEventForm(false);
      setEventForm({ name: '', deadline: '' });
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Events & Deadlines
        </h2>
        <p className="text-xs text-gray-500">Click any date to add an event</p>
      </div>

      {/* Add Event Form */}
      {showEventForm && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Add Event/Deadline</h3>
            <button
              onClick={() => setShowEventForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddEvent}>
            <input
              type="text"
              value={eventForm.name}
              onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
              placeholder="Goal name..."
              className="w-full px-4 py-2 mb-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              autoFocus
            />
            <input
              type="date"
              value={eventForm.deadline}
              onChange={(e) => setEventForm({ ...eventForm, deadline: e.target.value })}
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
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-xl transition"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          height="auto"
          eventDisplay="block"
          displayEventTime={false}
          dayMaxEvents={3}
          editable={false}
        />
      </div>
    </div>
  );
}
