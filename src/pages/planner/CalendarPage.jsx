import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { usePlanner } from "../../context/PlannerContext";
import { Calendar as CalendarIcon, X, LayoutDashboard } from "lucide-react";
import "./Calendar.css";

export default function CalendarPage() {
  const { goals, events, addGoal } = usePlanner();
  const navigate = useNavigate();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ name: '', deadline: '' });

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
          extendedProps: {
            description: event.description
          }
        });
      }
    });
    
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Tab Navigation */}
      <header className="text-center mb-8">
        <h1 
          className="text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Daily Planner
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Bridge the gap between today's tasks and tomorrow's triumphs.
        </p>
        
        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Daily View
          </button>
          <button
            onClick={() => navigate('/planner/calendar')}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all bg-indigo-500 text-white shadow-lg shadow-indigo-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar View
          </button>
        </div>
      </header>

      {/* Calendar Container */}
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Full Calendar
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                <span>Goals</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Events</span>
              </div>
            </div>
          </div>

          {/* Add Event Form */}
          {showEventForm && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Add Goal/Deadline</h3>
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

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
              <div className="text-2xl font-bold text-violet-700">{goals.length}</div>
              <div className="text-sm text-violet-600">Total Goals</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-700">{events.length}</div>
              <div className="text-sm text-emerald-600">Total Events</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">
                {goals.length + events.length}
              </div>
              <div className="text-sm text-blue-600">Total Items</div>
            </div>
          </div>
          
          {/* Full Calendar */}
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              dateClick={handleDateClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto"
              eventDisplay="block"
              displayEventTime={false}
              dayMaxEvents={true}
              editable={false}
              eventClick={(info) => {
                // Show event details
                const desc = info.event.extendedProps?.description;
                if (desc) {
                  alert(`${info.event.title}\n\n${desc}`);
                }
              }}
            />
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Click any date to add a new goal. Use the buttons above to switch between month and week views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
