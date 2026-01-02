import { createContext, useContext, useEffect, useState } from "react";
import { careerEvents } from "../data/careerEvents";
import { daysSince } from "../utils/time";

const CareerContext = createContext();

export function CareerProvider({ children }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(careerEvents);
  }, []);

  return (
    <CareerContext.Provider value={{ events }}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  return useContext(CareerContext);
}
