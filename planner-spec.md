Here is your finalized, comprehensive .md file. I have designed this to be "LLM-Ready"—meaning it contains the specific technical vocabulary and UI constraints that will force an AI to generate high-quality, professional code rather than a generic to-do list.

Technical Specification: Professional Daily Task & Goal Planner
1. Project Vision
A high-end, minimalist productivity dashboard. The goal is to provide a "Single Source of Truth" where a user can log daily activities, track project deadlines, and visualize their progress through a clean, headline-style calendar and simple analytics.

2. Design System (Professional UI)
Theme: Modern Minimalist (SaaS-style).

Colors: * Background: #F8FAFC (Slate-50)

Cards: #FFFFFF (White)

Text: #0F172A (Slate-900)

Accents: #4F46E5 (Indigo-600) for actions; #E11D48 (Rose-600) for deadlines.

Typography: System Sans-Serif (Inter), Bold headings, muted secondary text.

Styling Rules: * Use rounded-2xl for all containers.

Use shadow-sm for cards; avoid heavy borders.

Consistent 24px padding (p-6) across all modules.

3. Core Features & Logic
A. The Daily Pulse (Top Section)
Quick Add: A centered, borderless input field for adding tasks instantly.

Activity Chart: A small, sleek AreaChart (Recharts) showing "Tasks Completed" over the last 7 days. This acts as the "Analysis" hub.

B. Smart Task Manager (Left Column)
Interaction: Checkboxes that trigger a "Strikethrough" and 50% opacity fade.

Sorting: Active tasks at the top, completed tasks automatically move to a "Recently Done" section at the bottom.

Drag & Drop: Implement hello-pangea/dnd for vertical reordering.

C. Future Goal/Project Tracker (Right Column)
Logic: Users enter a Project Name and a Deadline Date.

Countdown: The UI must calculate and display "X days remaining."

Visual: A simple progress bar showing how much of the project (tasks) is finished.

D. Headline Calendar (Bottom Section)
Library: FullCalendar (Month View).

UI Customization: * Remove default borders for a "Flat" look.

Tasks and Deadlines appear as Single-line Headlines on the date square.

Clicking a date filters the Task Manager to show that day's history.

4. Technical Stack Requirements
Frontend: React (Vite) + Tailwind CSS.

Icons: lucide-react.

Charts: recharts.

Animations: framer-motion (for smooth list entries and transitions).

State: Use a centralized Tasks state that the Calendar, Chart, and List all subscribe to.

5. Instructions for LLM Generation
"Act as a Senior Frontend Engineer. Build a professional, single-page React dashboard based on the provided technical spec.

CRITICAL REQUIREMENTS:

Use Tailwind CSS for a 'Linear.app' or 'Notion' inspired aesthetic.

Ensure the FullCalendar is styled to be borderless and minimalist.

Implement a Task-to-Goal link: when a task is created, allow it to be optionally assigned to a Project Deadline.

Use Framer Motion for a 'staggered' fade-in effect when the page loads.

The code must be modular, with the Logic (data handling) separated from the UI (components).

Include a 'Clear All' and 'Archive' function for old tasks to keep the UI clean."