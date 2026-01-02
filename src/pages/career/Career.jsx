import { useMemo } from "react";
import { useCareer } from "../../context/CareerContext";
import { daysSince } from "../../utils/time";
import { calculateCareerPressure } from "../../utils/CareerPressure";

import Breadcrumbs from "../../components/common/Breadcrumbs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function Career() {
  const { events } = useCareer();

  const careerPressure = useMemo(
    () => calculateCareerPressure(events),
    [events]
  );

  const upcomingEvents = useMemo(() => {
    return events
      .map((e) => ({
        ...e,
        daysLeft: -daysSince(e.date),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [events]);

  return (
    <div className="space-y-6">
     <h1 className="text-2xl font-bold">Career Timeline</h1>
<p className="text-sm text-muted-foreground">
  Upcoming exams, applications, and placement milestones
</p>


      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Career" },
        ]}
      />
{events.length === 0 && (
  <OnboardingHint
    title="Add important dates"
    message="Track exams, applications, or placement deadlines so nothing sneaks up on you."
  />
)}

      {/* Career Pressure */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-sm opacity-90">
           Deadline Urgency

          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold">
              {careerPressure}
            </span>
            <span className="text-xl mb-1">/ 100</span>
          </div>

          <p className="text-sm opacity-90 mt-2">
Shows how close important academic or career dates are
          </p>
        </CardContent>
      </Card>

      {/* Events */}
      {upcomingEvents.length === 0 ? (
        <p className="text-muted-foreground">
          No upcoming career events.
        </p>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">
                    {event.title}
                  </CardTitle>

                  <Badge
                    className={
                      event.daysLeft <= 7
                        ? "bg-red-100 text-red-700"
                        : event.daysLeft <= 14
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {event.daysLeft <= 0
                      ? "Today / Passed"
                      : `${event.daysLeft} days left`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Type: {event.type}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Date:{" "}
                  {new Date(
                    event.date
                  ).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
