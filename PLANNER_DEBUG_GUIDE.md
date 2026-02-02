# Planner Activity Chart Debug Guide

## Issue Summary
The activity chart was not showing completed tasks because:
1. **Backend not running** - API calls to `http://localhost:4000/api/planner` were failing
2. **Incomplete error detection** - Need to check for `!error.response` in addition to `ERR_NETWORK`
3. **Date serialization** - completedAt dates need proper ISO string conversion when saving to localStorage
4. **Stale data** - Old localStorage data without proper completedAt timestamps

## Changes Made

### 1. Enhanced Error Detection (PlannerContext.jsx)
- Now checks for: `error.code === 'ERR_NETWORK' || !error.response`
- This catches all cases where backend is unavailable

### 2. Improved Seed Data
- Creates tasks with specific timestamps:
  - **Seed 1**: Completed today at 2:30 PM
  - **Seed 2**: Completed yesterday at 10:00 AM  
  - **Seed 3**: Active task (not completed)
- Properly sets `completedAt` as Date objects

### 3. Better localStorage Persistence
- Converts Date objects to ISO strings when saving
- Adds detailed console logging for debugging
- Shows completed tasks with completedAt in logs

### 4. Enhanced Logging
- All task operations now log to console
- Activity data computation shows what it's counting
- Toggle operations log before/after state

### 5. Development Reset Button
- Added "[Dev] Reset Planner Data" button in header
- Clears localStorage and reloads to test seed data

## Testing Steps

### Step 1: Clear Old Data
1. Open the planner page
2. Click **"[Dev] Reset Planner Data"** button
3. Confirm the dialog
4. Page will reload with fresh seed data

### Step 2: Verify Seed Data Loaded
Open browser console (F12) and look for:
```
[PlannerContext] Creating seed data with dates: { yesterday: '...', today: '...' }
[PlannerContext] Seed tasks created: [...]
[PlannerContext] Tasks persisted to localStorage: 3 tasks
[PlannerContext] Completed tasks with completedAt: [{ id: 'seed-1', ... }, { id: 'seed-2', ... }]
```

### Step 3: Check Activity Chart
The activity chart should now show:
- **Yesterday**: 1 completed task (bar height = 1)
- **Today**: 1 completed task (bar height = 1)
- Other days: 0 tasks

### Step 4: Test Task Toggle
1. Mark "Team standup meeting" as complete
2. Check console for:
   ```
   [PlannerContext] Toggling task: seed-3 completed: true completedAt: 2026-02-02T...
   [PlannerContext] Backend not available, keeping optimistic update
   [PlannerContext] Task after toggle: { completed: true, completedAt: Date(...) }
   ```
3. Activity chart should immediately show **Today: 2 tasks**

### Step 5: Check localStorage
In browser console, run:
```javascript
JSON.parse(localStorage.getItem('blaezi_planner_tasks'))
```

Should show all tasks with:
- `completed: true/false`
- `completedAt: "2026-02-02T..." or null`

## Expected Activity Data Computation

Console should show:
```
[PlannerContext] Computing activityData from 3 tasks
[PlannerContext] Completed tasks with completedAt: [
  { id: 'seed-1', title: 'Review morning emails', completedAt: Date(...), dateKey: '2026-02-02' },
  { id: 'seed-2', title: 'Complete project documentation', completedAt: Date(...), dateKey: '2026-02-01' }
]
[PlannerContext] activityData computed: [
  { date: 'Jan 27', tasks: 0 },
  { date: 'Jan 28', tasks: 0 },
  { date: 'Jan 29', tasks: 0 },
  { date: 'Jan 30', tasks: 0 },
  { date: 'Jan 31', tasks: 0 },
  { date: 'Feb 1', tasks: 1 },   // Yesterday's task
  { date: 'Feb 2', tasks: 1 }    // Today's task
]
```

## Backend Status
Currently the backend is **NOT running**. The frontend is operating in **fallback mode** with:
- localStorage persistence
- Seed data on first load
- Optimistic updates for all operations

### When Backend is Available
Once backend is running at `http://localhost:4000/api`:
1. API calls will succeed
2. Data will sync with MongoDB
3. localStorage will be used as cache
4. Fallback mode will no longer activate

### Backend API Endpoint Expected
- Base URL: `http://localhost:4000/api/planner`
- Endpoints needed:
  - `GET /tasks` - Returns all tasks
  - `POST /tasks` - Create task
  - `PATCH /tasks/:id` - Update task (used for toggle)
  - `DELETE /tasks/:id` - Delete task
  - `GET /goals` - Returns all goals
  - etc. (see PLANNER_BACKEND_SPEC.md)

## Troubleshooting

### Chart still shows no data
1. Open console (F12)
2. Check for "activityData computed" log
3. Verify tasks have `completed: true` AND `completedAt: "date"`
4. If missing, click Reset button to get fresh seed data

### Tasks not persisting after reload
1. Check localStorage in Application tab (F12)
2. Look for `blaezi_planner_tasks` key
3. If empty, seed data should load automatically

### Toggle not working
1. Check console for "Toggling task" log
2. Should see "Backend not available, keeping optimistic update"
3. Verify completedAt is set in the log

### Dates showing as invalid
1. Check console for date parsing errors
2. All dates should be ISO strings in localStorage
3. All dates should be Date objects in memory

## Console Commands for Debugging

### View current tasks in state
```javascript
// In React DevTools, find PlannerContext and inspect tasks state
```

### Manually check localStorage
```javascript
const tasks = JSON.parse(localStorage.getItem('blaezi_planner_tasks'));
console.log('Tasks:', tasks);
console.log('Completed with dates:', tasks.filter(t => t.completed && t.completedAt));
```

### Manually add a completed task for testing
```javascript
const tasks = JSON.parse(localStorage.getItem('blaezi_planner_tasks')) || [];
tasks.push({
  id: 'test-' + Date.now(),
  title: 'Test completed task',
  completed: true,
  completedAt: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  order: tasks.length,
  archived: false,
  goalId: null
});
localStorage.setItem('blaezi_planner_tasks', JSON.stringify(tasks));
location.reload();
```

## Next Steps

1. **For Testing**: Use the Reset button to clear and reload seed data
2. **For Development**: Keep console open to monitor all operations
3. **For Production**: Backend needs to be implemented (see PLANNER_BACKEND_SPEC.md)

---

**Last Updated**: February 2, 2026  
**Status**: Frontend fully functional in fallback mode, backend pending
