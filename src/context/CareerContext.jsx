import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { 
  getAllEvents, 
  createEvent as createEventAPI, 
  updateEvent as updateEventAPI, 
  deleteEvent as deleteEventAPI,
  addPreparationStep as addPreparationStepAPI,
  toggleStepCompletion as toggleStepCompletionAPI,
  deletePreparationStep as deletePreparationStepAPI
} from "../services/careerService";
import { useAuth } from "./AuthContext";

const CareerContext = createContext();

export function CareerProvider({ children }) {
  console.log('[CareerProvider] RENDER');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  // Re-fetch when user authentication changes
  useEffect(() => {
    const loadEvents = async () => {
      console.log('[CareerContext] loadEvents: authLoading =', authLoading, 'isAuthenticated =', isAuthenticated);
      // Don't fetch while auth is still loading
      if (authLoading) {
        console.log('[CareerContext] loadEvents: Auth still loading, skipping');
        return;
      }
      
      if (!isAuthenticated) {
        console.log('[CareerContext] loadEvents: Not authenticated, clearing events');
        setEvents([]);
        setLoading(false);
        return;
      }
      
      try {
        console.log('[CareerContext] loadEvents: Fetching events from backend...');
        setLoading(true);
        const response = await getAllEvents();
        console.log('[CareerContext] loadEvents: Response:', response);
        // Handle response: could be array directly or {success, data: []}
        const data = Array.isArray(response) ? response : (response?.data || []);
        console.log('[CareerContext] loadEvents: Events:', Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
        
        // Log first event to see structure
        if (data.length > 0) {
          console.log('[CareerContext] ⚠️ FIRST EVENT STRUCTURE:', JSON.stringify(data[0], null, 2));
        }
        
        // Normalize events to ensure they have id field and preparation array
        // Backend uses "preparationSteps" and "isCompleted", frontend uses "preparation" and "done"
        const normalizedEvents = data.map(event => ({
          ...event,
          id: event._id || event.id,
          completed: event.status === 'completed',
          preparation: (event.preparationSteps || event.preparation || []).map(step => ({
            id: step._id || step.id,
            title: step.title,
            done: step.isCompleted || step.done || false
          }))
        }));
        console.log('[CareerContext] Normalized first event preparation:', normalizedEvents[0]?.preparation);
        setEvents(normalizedEvents);
      } catch (error) {
        console.error('[CareerContext] Error loading career events:', error);
        setEvents([]);
      } finally {
        console.log('[CareerContext] loadEvents: Complete, setting loading to false');
        setLoading(false);
      }
    };

    loadEvents();
  }, [authLoading, isAuthenticated]);

  /* ---------- STEP ACTIONS ---------- */

  const addPreparationStep = useCallback(async (eventId, title) => {
    try {
      console.log('[CareerContext] addPreparationStep: Event:', eventId, 'Title:', title);
      
      // Add step to backend
      await addPreparationStepAPI(eventId, { title });
      
      console.log('[CareerContext] addPreparationStep: Backend updated, reloading events...');
      
      // Reload all events to get the updated preparation array
      const response = await getAllEvents();
      const data = Array.isArray(response) ? response : (response?.data || []);
      console.log('[CareerContext] Reloaded events:', data);
      // Normalize events - map preparationSteps to preparation
      const normalizedEvents = data.map(event => ({
        ...event,
        id: event._id || event.id,
        completed: event.status === 'completed',
        preparation: (event.preparationSteps || event.preparation || []).map(step => ({
          id: step._id || step.id,
          title: step.title,
          done: step.isCompleted || step.done || false
        }))
      }));
      setEvents(normalizedEvents);
      
      console.log('[CareerContext] ✅ Preparation step added successfully');
    } catch (error) {
      console.error('[CareerContext] ❌ Error adding preparation step:', error.message);
      alert('Failed to add preparation step. Please try again.');
    }
  }, []);

  const togglePreparationStep = useCallback(async (eventId, stepId, done) => {
    try {
      console.log('[CareerContext] togglePreparationStep: Event:', eventId, 'Step:', stepId, 'Done:', done);
      
      // Update backend
      await toggleStepCompletionAPI(eventId, stepId, done);
      
      console.log('[CareerContext] togglePreparationStep: Backend updated, reloading events...');
      
      // Reload all events to get the updated preparation array
      const response = await getAllEvents();
      const data = Array.isArray(response) ? response : (response?.data || []);
      console.log('[CareerContext] Reloaded events after toggle:', data);
      // Normalize events - map preparationSteps to preparation
      const normalizedEvents = data.map(event => ({
        ...event,
        id: event._id || event.id,
        completed: event.status === 'completed',
        preparation: (event.preparationSteps || event.preparation || []).map(step => ({
          id: step._id || step.id,
          title: step.title,
          done: step.isCompleted || step.done || false
        }))
      }));
      setEvents(normalizedEvents);
      
      console.log('[CareerContext] ✅ Preparation step toggled successfully');
    } catch (error) {
      console.error('[CareerContext] ❌ Error toggling preparation step:', error.message);
      alert('Failed to update preparation step. Please try again.');
    }
  }, []);

  const deletePreparationStep = useCallback(async (eventId, stepId) => {
    try {
      console.log('[CareerContext] deletePreparationStep: Event:', eventId, 'Step:', stepId);
      
      // Delete from backend
      await deletePreparationStepAPI(eventId, stepId);
      
      console.log('[CareerContext] deletePreparationStep: Backend deleted, reloading events...');
      
      // Reload all events to get the updated preparation array
      const response = await getAllEvents();
      const data = Array.isArray(response) ? response : (response?.data || []);
      // Normalize events - map preparationSteps to preparation
      const normalizedEvents = data.map(event => ({
        ...event,
        id: event._id || event.id,
        completed: event.status === 'completed',
        preparation: (event.preparationSteps || event.preparation || []).map(step => ({
          id: step._id || step.id,
          title: step.title,
          done: step.isCompleted || step.done || false
        }))
      }));
      setEvents(normalizedEvents);
      
      console.log('[CareerContext] ✅ Preparation step deleted successfully');
    } catch (error) {
      console.error('[CareerContext] ❌ Error deleting preparation step:', error.message);
      alert('Failed to delete preparation step. Please try again.');
    }
  }, []);

  const addEvent = useCallback(async (eventData) => {
    try {
      console.log('[CareerContext] addEvent: Creating event:', eventData);
      
      // Create event on backend
      const response = await createEventAPI({
        title: eventData.title,
        date: eventData.date,
        type: eventData.type || "Event",
        completed: false,
        preparation: [],
      });
      
      console.log('[CareerContext] addEvent: Response received:', response);
      
      // Handle response: could be object directly or {success, data: {...}}
      const newEvent = response?.data || response;
      
      console.log('[CareerContext] addEvent: New event:', newEvent);
      
      // Verify we got a valid event back
      if (!newEvent || (!newEvent.id && !newEvent._id)) {
        console.error('[CareerContext] addEvent: Invalid response - no event ID');
        throw new Error('Invalid response from server - no event ID');
      }
      
      // Add event to local state
      setEvents((prev) => {
        const updated = [...prev, {
          ...newEvent,
          id: newEvent._id || newEvent.id,
          preparation: newEvent.preparation || []
        }];
        console.log('[CareerContext] addEvent: Updated events count:', updated.length);
        return updated;
      });
      
      console.log('[CareerContext] ✅ Event created successfully');
      
    } catch (error) {
      console.error('[CareerContext] ❌ Error creating event:', error.message);
      console.error('[CareerContext] Full error:', error);
      
      // Show user-friendly error message
      alert(`Failed to create event: ${error.response?.data?.message || error.message}. Please check your connection and try again.`);
    }
  }, []);

  const toggleEvent = useCallback(async (eventId, completed) => {
    try {
      console.log('[CareerContext] toggleEvent: ID:', eventId, 'Completed:', completed);
      
      // Update backend first
      const response = await updateEventAPI(eventId, { completed });
      console.log('[CareerContext] toggleEvent: Backend updated:', response);
      
      // Then update local state
      setEvents((prev) =>
        prev.map((event) =>
          (event.id === eventId || event._id === eventId)
            ? { ...event, completed }
            : event
        )
      );
      
      console.log('[CareerContext] ✅ Event toggled successfully');
    } catch (error) {
      console.error('[CareerContext] ❌ Error toggling event:', error.message);
      alert('Failed to update event. Please try again.');
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      console.log('[CareerContext] deleteEvent: ID:', eventId);
      
      // Delete from backend first
      await deleteEventAPI(eventId);
      console.log('[CareerContext] deleteEvent: Backend deleted');
      
      // Then remove from local state
      setEvents((prev) =>
        prev.filter((event) => event.id !== eventId && event._id !== eventId)
      );
      
      console.log('[CareerContext] ✅ Event deleted successfully');
    } catch (error) {
      console.error('[CareerContext] ❌ Error deleting event:', error.message);
      alert('Failed to delete event. Please try again.');
    }
  }, []);

  const value = useMemo(
    () => ({
      events,
      loading,
      addPreparationStep,
      togglePreparationStep,
      deletePreparationStep,
      toggleEvent,
      deleteEvent,
      addEvent,
    }),
    [events, loading, addPreparationStep, togglePreparationStep, deletePreparationStep, toggleEvent, deleteEvent, addEvent]
  );

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  return useContext(CareerContext);
}
