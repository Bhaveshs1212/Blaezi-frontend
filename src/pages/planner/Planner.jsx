import { usePlanner } from "../../context/PlannerContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import TaskManager from "./TaskManager";
import GoalTracker from "./GoalTracker";
import Events from "./Events";
import ActivityChart from "./ActivityChart";
import { Calendar as CalendarIcon, LayoutDashboard } from "lucide-react";

export default function Planner() {
  const { loading } = usePlanner();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isCalendarView = location.pathname === '/planner/calendar';

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
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
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              !isCalendarView
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Daily View
          </button>
          <button
            onClick={() => navigate('/planner/calendar')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              isCalendarView
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar View
          </button>
        </div>
      </header>

      {/* The Daily Pulse - Top Section */}
      <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
        <h2 
          className="text-lg font-semibold text-gray-900 mb-6"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Daily Pulse
        </h2>
        
        {/* Activity Chart */}
        <ActivityChart />
      </div>

      {/* Main Content - Task Manager & Goal Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Manager - Left Column (2/3) */}
        <div className="lg:col-span-2">
          <TaskManager />
        </div>

        {/* Goal Tracker - Right Column (1/3) */}
        <div className="lg:col-span-1">
          <GoalTracker />
        </div>
      </div>

      {/* Events Section */}
      <Events />
    </div>
  );
}
