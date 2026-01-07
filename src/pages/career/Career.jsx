import { useMemo, useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { daysSince } from "../../utils/time";
import { calculateCareerPressure } from "../../utils/CareerPressure";

import Breadcrumbs from "../../components/common/Breadcrumbs";
import OnboardingHint from "../../components/common/Onboarding";
import CareerEventRow from "./CareerEventRow";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export default function Career() {
  const { events, addEvent, loading } = useCareer();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "Exam",
  });

  /* ---------------- PRESSURE ---------------- */

  const careerPressure = useMemo(
    () => calculateCareerPressure(events),
    [events]
  );

  /* ---------------- SORT EVENTS ---------------- */

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => !e.completed)
      .map((e) => ({
        ...e,
        daysLeft: -daysSince(e.date),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [events]);

  const completedEvents = events.filter(
    (e) => e.completed
  );

  const nextEvent = upcomingEvents[0];

  /* ---------------- PREP PROGRESS ---------------- */

  const getPrepProgress = (event) => {
    if (!event || !event.preparation || !Array.isArray(event.preparation)) return 0;
    const total = event.preparation.length;
    if (total === 0) return 0;
    const done = event.preparation.filter(
      (s) => s.done
    ).length;
    return Math.round((done / total) * 100);
  };

  /* ---------------- LOADING STATE ---------------- */
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading career events...</p>
        </div>
      </div>
    );
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;
    
    addEvent(formData);
    setFormData({ title: "", date: "", type: "Exam" });
    setShowForm(false);
  };

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Career
          </h1>
          <p className="text-lg text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Exams, applications, and preparation plans
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#6366F1] text-white text-sm font-medium rounded-full hover:bg-[#5558E3] transition"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {showForm ? "Cancel" : "+ Add Event"}
        </button>
      </div>

      {/* ADD EVENT FORM */}
      {showForm && (
        <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Add New Event
          </h3>
          <form onSubmit={handleAddEvent} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., GATE 2026, Google Interview"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="Exam">Exam</option>
                <option value="Interview">Interview</option>
                <option value="Application">Application</option>
                <option value="Placement">Placement</option>
                <option value="Other">Other</option>
              </select>
            </div>

<button
              type="submit"
              className="w-full px-6 py-3.5 bg-[#6366F1] text-white text-sm font-medium rounded-full hover:bg-[#5558E3] transition"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Add Event
            </button>
          </form>
        </div>
      )}

      {events.length === 0 && (
        <OnboardingHint
          title="Add important dates"
          message="Track exams, applications, or placement deadlines and break them into preparation steps."
        />
      )}

      {/* NEXT CRITICAL EVENT */}
      {nextEvent && (
        <div className="rounded-3xl bg-[#6366F1] text-white p-10 shadow-lg">
          <p className="text-sm font-light opacity-90 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Next Critical Deadline
          </p>

          <div className="space-y-4">
            <p className="text-2xl font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {nextEvent.title}
            </p>

            <p className="text-sm font-light opacity-90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {nextEvent.daysLeft} days left • {getPrepProgress(nextEvent)}% prepared
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${getPrepProgress(nextEvent)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CAREER PRESSURE */}
      <div className="rounded-3xl bg-white border border-gray-100 p-10">
        <p className="text-sm font-medium text-gray-500 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Career Pressure
        </p>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {careerPressure}
          </span>
          <span className="text-xl text-gray-500 mb-2 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            / 100
          </span>
        </div>

        <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Based on upcoming deadlines and preparation
        </p>
      </div>

      {/* UPCOMING EVENTS */}
      <Section title="Upcoming">
        {upcomingEvents.map((event) => (
          <CareerEventRow
            key={event.id}
            event={event}
          />
        ))}
      </Section>

      {/* COMPLETED EVENTS */}
      {completedEvents.length > 0 && (
        <Section title="Completed">
          {completedEvents.map((event) => (
            <CareerEventRow
              key={event.id}
              event={event}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

/* ---------------- SMALL HELPERS ---------------- */

function Section({ title, children }) {
  if (!children.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h2>

      <div className="rounded-3xl bg-white border border-gray-100 divide-y divide-gray-100 shadow-sm">
        {children}
      </div>
    </section>
  );
}
