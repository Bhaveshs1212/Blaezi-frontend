import { useMemo } from "react";
import { useCareer } from "../../context/CareerContext";
import { daysUntil } from "../../utils/time";
import { calculateCareerPressure } from "../../utils/CareerPressure";

import Breadcrumbs from "../../components/common/Breadcrumbs";
import CareerEventRow from "./CareerEventRow";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export default function Career() {
  const { events } = useCareer();

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
        daysLeft: daysUntil(e.date),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [events]);

  const completedEvents = events.filter(
    (e) => e.completed
  );

  const nextEvent = upcomingEvents[0];

  /* ---------------- PREP PROGRESS ---------------- */

  const getPrepProgress = (event) => {
    const total = event.preparation.length;
    if (total === 0) return 0;
    const done = event.preparation.filter(
      (s) => s.done
    ).length;
    return Math.round((done / total) * 100);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Career
        </h1>
        <p className="text-sm text-muted-foreground">
          Exams, applications, and preparation plans
        </p>
      </div>

      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Career" },
        ]}
      />

      {events.length === 0 && (
        <OnboardingHint
          title="Add important dates"
          message="Track exams, applications, or placement deadlines and break them into preparation steps."
        />
      )}

      {/* NEXT CRITICAL EVENT */}
      {nextEvent && (
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <CardHeader>
            <CardTitle className="text-sm opacity-90">
              Next Critical Deadline
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-xl font-semibold">
              {nextEvent.title}
            </p>

            <p className="text-sm opacity-90">
              {nextEvent.daysLeft} days left •{" "}
              {getPrepProgress(nextEvent)}%
              prepared
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${getPrepProgress(
                    nextEvent
                  )}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* CAREER PRESSURE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Career Pressure
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">
              {careerPressure}
            </span>
            <span className="text-lg mb-1">
              / 100
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Based on upcoming deadlines and preparation
          </p>
        </CardContent>
      </Card>

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
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {title}
      </h2>

      <div className="rounded-xl bg-white border border-slate-200 divide-y">
        {children}
      </div>
    </section>
  );
}
