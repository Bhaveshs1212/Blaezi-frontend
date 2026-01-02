import { createContext, useContext, useState } from "react";

const CareerContext = createContext();

export function CareerProvider({ children }) {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "GATE 2025",
      date: "2025-02-02",
      type: "Exam",
      completed: false,
      preparation: [
        { id: 1, title: "Engineering Mathematics", done: true },
        { id: 2, title: "Control Systems", done: false },
      ],
    },
  ]);

  /* ---------- STEP ACTIONS ---------- */

  const addPreparationStep = (eventId, title) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              preparation: [
                ...event.preparation,
                {
                  id: Date.now(),
                  title,
                  done: false,
                },
              ],
            }
          : event
      )
    );
  };

  const togglePreparationStep = (eventId, stepId, done) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              preparation: event.preparation.map((step) =>
                step.id === stepId
                  ? { ...step, done }
                  : step
              ),
            }
          : event
      )
    );
  };

  const toggleEvent = (eventId, completed) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, completed }
          : event
      )
    );
  };

  return (
    <CareerContext.Provider
      value={{
        events,
        addPreparationStep,
        togglePreparationStep,
        toggleEvent,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export const useCareer = () => useContext(CareerContext);
