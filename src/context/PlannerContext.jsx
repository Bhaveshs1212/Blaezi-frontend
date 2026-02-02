import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { 
  getAllTasks, 
  createTask as createTaskAPI, 
  updateTask as updateTaskAPI, 
  deleteTask as deleteTaskAPI,
  bulkUpdateTasks as bulkUpdateTasksAPI,
  getAllGoals,
  createGoal as createGoalAPI,
  updateGoal as updateGoalAPI,
  deleteGoal as deleteGoalAPI,
  getPlannerStats,
  getActivityData
} from "../services/plannerService";
import {
  getEventsAPI,
  createEventAPI,
  updateEventAPI,
  deleteEventAPI
} from "../services/eventService";
import { useAuth } from "./AuthContext";

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch tasks and goals from backend
  useEffect(() => {
    const loadPlannerData = async () => {
      if (authLoading) return;
      
      if (!isAuthenticated) {
        setTasks([]);
        setGoals([]);
        setEvents([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch tasks (exclude archived by default)
        const tasksResponse = await getAllTasks({ archived: false });
        const tasksData = Array.isArray(tasksResponse) ? tasksResponse : (tasksResponse?.data || []);
        
        // Normalize tasks
        const normalizedTasks = tasksData.map(task => ({
          ...task,
          id: task._id || task.id,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
        }));
        
        console.log('[PlannerContext] Loaded tasks from backend:', normalizedTasks.length);
        
        // Fetch goals
        const goalsResponse = await getAllGoals();
        const goalsData = Array.isArray(goalsResponse) ? goalsResponse : (goalsResponse?.data || []);
        
        // Normalize goals
        const normalizedGoals = goalsData.map(goal => ({
          ...goal,
          id: goal._id || goal.id,
          deadline: goal.deadline ? new Date(goal.deadline) : null,
        }));
        
        console.log('[PlannerContext] Loaded goals from backend:', normalizedGoals.length);
        
        setTasks(normalizedTasks);
        setGoals(normalizedGoals);
        
        // Fetch events (optional - don't fail if endpoint doesn't exist)
        try {
          const eventsResponse = await getEventsAPI();
          const eventsData = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse?.data || []);
          
          // Normalize events
          const normalizedEvents = eventsData.map(event => ({
            ...event,
            id: event._id || event.id,
            date: event.date ? new Date(event.date) : null,
          }));
          
          console.log('[PlannerContext] Loaded events from backend:', normalizedEvents.length);
          setEvents(normalizedEvents);
        } catch (eventError) {
          console.warn('[PlannerContext] Events endpoint not available yet:', eventError.message);
          setEvents([]);
        }
      } catch (error) {
        console.error('[PlannerContext] Error loading planner data:', error);
        console.error('[PlannerContext] Error details:', {
          code: error.code,
          status: error.response?.status,
          message: error.message
        });
        
        // Show empty state on error
        setTasks([]);
        setGoals([]);
        setEvents([]);
        
        // Don't throw - let the UI handle the empty state
        if (error.response?.status === 401) {
          console.error('[PlannerContext] Authentication error - user should be redirected to login');
        } else {
          console.error('[PlannerContext] Failed to load planner data. Backend may not be running.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlannerData();
  }, [authLoading, isAuthenticated]);

  /* ---------- COMPUTED VALUES ---------- */

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        try {
          const date = task.dueDate instanceof Date 
            ? task.dueDate 
            : new Date(task.dueDate);
          const dateKey = date.toISOString().split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(task);
        } catch (error) {
          console.error('[PlannerContext] Error grouping task by date:', error, task);
        }
      }
    });
    console.log('[PlannerContext] tasksByDate:', grouped);
    return grouped;
  }, [tasks]);

  // Activity data for last 7 days (for chart)
  const activityData = useMemo(() => {
    const last7Days = [];
    // Use current local date to avoid timezone issues
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0]; // Get YYYY-MM-DD in local context
    
    console.log('[PlannerContext] ===== ACTIVITY DATA COMPUTATION =====');
    console.log('[PlannerContext] Today date key:', todayKey);
    console.log('[PlannerContext] Total tasks:', tasks.length);
    console.log('[PlannerContext] Completed tasks:', tasks.filter(t => t.completed).length);
    console.log('[PlannerContext] Tasks with completedAt:', tasks.filter(t => t.completedAt).length);
    
    // Show ALL completed tasks with their dates
    const completedWithDates = tasks.filter(t => t.completed && t.completedAt).map(t => {
      const date = t.completedAt instanceof Date ? t.completedAt : new Date(t.completedAt);
      return {
        id: t.id,
        title: t.title,
        completedAt: date.toISOString(),
        dateKey: date.toISOString().split('T')[0]
      };
    });
    console.log('[PlannerContext] Completed tasks with dates:', completedWithDates);
    
    // Generate date keys for last 7 days
    const dateKeys = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dateKeys.push(key);
    }
    console.log('[PlannerContext] Checking date range:', dateKeys[0], 'to', dateKeys[6]);
    
    // Count tasks for each day
    dateKeys.forEach((dateKey, index) => {
      const dayLabel = new Date(dateKey + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      console.log(`[PlannerContext] Checking ${dateKey}...`);
      
      const completedCount = tasks.filter(task => {
        if (!task.completed || !task.completedAt) return false;
        try {
          const completedDate = task.completedAt instanceof Date 
            ? task.completedAt 
            : new Date(task.completedAt);
          const taskDateKey = completedDate.toISOString().split('T')[0];
          const matches = taskDateKey === dateKey;
          
          if (matches) {
            console.log(`[PlannerContext]   ✓ Match: "${task.title}" (${taskDateKey})`);
          }
          
          return matches;
        } catch (error) {
          console.error('[PlannerContext] Error parsing completedAt:', error, task);
          return false;
        }
      }).length;
      
      console.log(`[PlannerContext] Day ${dateKey}: ${completedCount} tasks`);
      
      last7Days.push({
        date: dayLabel,
        tasks: completedCount
      });
    });
    
    console.log('[PlannerContext] ===== FINAL ACTIVITY DATA =====');
    console.log('[PlannerContext] activityData:', last7Days);
    console.log('[PlannerContext] Total in chart:', last7Days.reduce((sum, d) => sum + d.tasks, 0));
    return last7Days;
  }, [tasks]);

  // Active (incomplete) tasks sorted by date and order
  const activeTasks = useMemo(() => {
    return tasks
      .filter(task => !task.completed)
      .sort((a, b) => {
        // Sort by order field first, then by due date
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.dueDate && b.dueDate) {
          return a.dueDate - b.dueDate;
        }
        return 0;
      });
  }, [tasks]);

  // Recently completed tasks
  const completedTasks = useMemo(() => {
    return tasks
      .filter(task => task.completed)
      .sort((a, b) => {
        if (a.completedAt && b.completedAt) {
          return b.completedAt - a.completedAt; // Most recent first
        }
        return 0;
      })
      .slice(0, 10); // Only show last 10
  }, [tasks]);

  // Tasks filtered by selected date (for calendar interaction)
  const filteredTasks = useMemo(() => {
    if (!selectedDate) return activeTasks;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && task.dueDate.toISOString().split('T')[0] === dateKey
    );
  }, [tasks, selectedDate, activeTasks]);

  /* ---------- TASK ACTIONS ---------- */

  const addTask = useCallback(async (taskData) => {
    try {
      const response = await createTaskAPI(taskData);
      // Handle response.data or direct response
      const taskResponse = response.data || response;
      const newTask = {
        ...taskResponse,
        id: taskResponse._id || taskResponse.id,
        dueDate: taskResponse.dueDate ? new Date(taskResponse.dueDate) : null,
        completedAt: taskResponse.completedAt ? new Date(taskResponse.completedAt) : null,
      };
      
      console.log('[PlannerContext] Task added:', newTask);
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('[PlannerContext] Error adding task:', error);
      
      // Fallback: Add task locally if backend not ready
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('[PlannerContext] Backend not available, adding task locally');
        const localTask = {
          ...taskData,
          id: `temp-${Date.now()}`,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          completed: taskData.completed || false,
          completedAt: null,
          order: tasks.length,
          archived: false,
          goalId: taskData.goalId || null
        };
        console.log('[PlannerContext] Local task created:', localTask);
        setTasks(prev => [...prev, localTask]);
      } else {
        alert('Failed to add task. Please try again.');
      }
    }
  }, [tasks.length]);

  const toggleTask = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date();
    const updates = {
      completed: !task.completed,
      completedAt: !task.completed ? now.toISOString() : null
    };

    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, completed: updates.completed, completedAt: updates.completedAt ? new Date(updates.completedAt) : null } 
        : t
    );
    setTasks(updatedTasks);

    console.log('[PlannerContext] Toggling task:', taskId, 'completed:', updates.completed, 'completedAt:', updates.completedAt);
    
    try {
      await updateTaskAPI(taskId, updates);
      console.log('[PlannerContext] Task toggled successfully');
    } catch (error) {
      console.error('[PlannerContext] Error toggling task:', error);
      // Revert on error
      setTasks(tasks);
      alert('Failed to update task. Please check if the backend is running.');
    }
  }, [tasks]);

  const updateTaskDetails = useCallback(async (taskId, updates) => {
    try {
      const response = await updateTaskAPI(taskId, updates);
      // Handle response.data or direct response
      const taskResponse = response.data || response;
      const updatedTask = {
        ...taskResponse,
        id: taskResponse._id || taskResponse.id,
        dueDate: taskResponse.dueDate ? new Date(taskResponse.dueDate) : null,
        completedAt: taskResponse.completedAt ? new Date(taskResponse.completedAt) : null,
      };
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('[PlannerContext] Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  }, []);

  const removeTask = useCallback(async (taskId) => {
    const originalTasks = tasks;
    
    try {
      // Optimistically remove from UI
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      // Delete from backend
      await deleteTaskAPI(taskId);
      console.log('[PlannerContext] Task deleted successfully:', taskId);
    } catch (error) {
      console.error('[PlannerContext] Error deleting task:', error);
      // Revert on error
      setTasks(originalTasks);
      alert('Failed to delete task. Please check if the backend is running.');
    }
  }, [tasks]);

  const reorderTasks = useCallback(async (reorderedTasks) => {
    const originalTasks = tasks;
    
    try {
      // Optimistically update UI
      setTasks(reorderedTasks);
      
      // Update backend
      await bulkUpdateTasksAPI(reorderedTasks.map((task, index) => ({
        id: task.id,
        order: index
      })));
      console.log('[PlannerContext] Tasks reordered successfully');
    } catch (error) {
      console.error('[PlannerContext] Error reordering tasks:', error);
      // Revert on error
      setTasks(originalTasks);
      alert('Failed to reorder tasks. Please check if the backend is running.');
    }
  }, [tasks]);

  const archiveCompletedTasks = useCallback(async () => {
    const tasksToArchive = tasks.filter(t => t.completed);
    
    if (tasksToArchive.length === 0) {
      return;
    }
    
    try {
      await bulkUpdateTasksAPI(tasksToArchive.map(task => ({
        id: task.id,
        archived: true
      })));
      
      // Remove archived tasks from state
      setTasks(prev => prev.filter(t => !t.completed));
    } catch (error) {
      console.error('[PlannerContext] Error archiving tasks:', error);
      alert('Failed to archive tasks. Please try again.');
    }
  }, [tasks]);

  /* ---------- GOAL ACTIONS ---------- */

  const addGoal = useCallback(async (goalData) => {
    try {
      const response = await createGoalAPI(goalData);
      // Handle response.data or direct response
      const goalResponse = response.data || response;
      const newGoal = {
        ...goalResponse,
        id: goalResponse._id || goalResponse.id,
        deadline: goalResponse.deadline ? new Date(goalResponse.deadline) : null,
      };
      
      console.log('[PlannerContext] Goal added:', newGoal);
      setGoals(prev => [...prev, newGoal]);
    } catch (error) {
      console.error('[PlannerContext] Error adding goal:', error);
      
      // Fallback: Add goal locally if backend not ready
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        console.warn('[PlannerContext] Backend not available, adding goal locally');
        const localGoal = {
          ...goalData,
          id: `temp-${Date.now()}`,
          deadline: goalData.deadline ? new Date(goalData.deadline) : null,
          tasks: [],
        };
        setGoals(prev => [...prev, localGoal]);
      } else {
        alert('Failed to add goal. Please try again.');
      }
    }
  }, []);

  const updateGoalDetails = useCallback(async (goalId, updates) => {
    try {
      const response = await updateGoalAPI(goalId, updates);
      // Handle response.data or direct response
      const goalResponse = response.data || response;
      const updatedGoal = {
        ...goalResponse,
        id: goalResponse._id || goalResponse.id,
        deadline: goalResponse.deadline ? new Date(goalResponse.deadline) : null,
      };
      
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
    } catch (error) {
      console.error('[PlannerContext] Error updating goal:', error);
      alert('Failed to update goal. Please try again.');
    }
  }, []);

  const removeGoal = useCallback(async (goalId) => {
    const originalGoals = goals;
    
    try {
      // Optimistically remove from UI
      setGoals(prev => prev.filter(g => g.id !== goalId));
      
      // Delete from backend
      await deleteGoalAPI(goalId);
      console.log('[PlannerContext] Goal deleted successfully:', goalId);
    } catch (error) {
      console.error('[PlannerContext] Error deleting goal:', error);
      // Revert on error
      setGoals(originalGoals);
      alert('Failed to delete goal. Please check if the backend is running.');
    }
  }, [goals]);

  /* ---------- EVENT ACTIONS ---------- */

  const addEvent = useCallback(async (eventData) => {
    try {
      const response = await createEventAPI(eventData);
      const eventResponse = response.data || response;
      const newEvent = {
        ...eventResponse,
        id: eventResponse._id || eventResponse.id,
        date: eventResponse.date ? new Date(eventResponse.date) : null,
      };
      
      console.log('[PlannerContext] Event added:', newEvent);
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('[PlannerContext] Error adding event:', error);
      alert('Failed to add event. Please check if the backend is running.');
    }
  }, []);

  const updateEventDetails = useCallback(async (eventId, updates) => {
    try {
      const response = await updateEventAPI(eventId, updates);
      const eventResponse = response.data || response;
      const updatedEvent = {
        ...eventResponse,
        id: eventResponse._id || eventResponse.id,
        date: eventResponse.date ? new Date(eventResponse.date) : null,
      };
      
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    } catch (error) {
      console.error('[PlannerContext] Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  }, []);

  const removeEvent = useCallback(async (eventId) => {
    const originalEvents = events;
    
    try {
      // Optimistically remove from UI
      setEvents(prev => prev.filter(e => e.id !== eventId));
      
      // Delete from backend
      await deleteEventAPI(eventId);
      console.log('[PlannerContext] Event deleted successfully:', eventId);
    } catch (error) {
      console.error('[PlannerContext] Error deleting event:', error);
      // Revert on error
      setEvents(originalEvents);
      alert('Failed to delete event. Please check if the backend is running.');
    }
  }, [events]);

  /* ---------- CONTEXT VALUE ---------- */

  const value = useMemo(
    () => ({
      tasks,
      goals,
      events,
      loading,
      selectedDate,
      
      // Computed values
      tasksByDate,
      activityData,
      activeTasks,
      completedTasks,
      filteredTasks,
      
      // Task actions
      addTask,
      toggleTask,
      updateTaskDetails,
      removeTask,
      reorderTasks,
      archiveCompletedTasks,
      
      // Goal actions
      addGoal,
      updateGoalDetails,
      removeGoal,
      
      // Event actions
      addEvent,
      updateEventDetails,
      removeEvent,
      
      // Calendar interaction
      setSelectedDate,
    }),
    [
      tasks, 
      goals,
      events,
      loading, 
      selectedDate,
      tasksByDate,
      activityData,
      activeTasks,
      completedTasks,
      filteredTasks,
      addTask,
      toggleTask,
      updateTaskDetails,
      removeTask,
      reorderTasks,
      archiveCompletedTasks,
      addGoal,
      updateGoalDetails,
      removeGoal,
      addEvent,
      updateEventDetails,
      removeEvent,
    ]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
