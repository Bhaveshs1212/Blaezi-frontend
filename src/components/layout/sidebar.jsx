import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 px-4 py-6">
      {/* Brand */}
      <div className="mb-10">
        <h1 className="font-heading text-2xl font-semibold text-indigo-600">
          Blaezi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Productivity OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <SidebarLink to="/dashboard" label="Dashboard" />
        <SidebarLink to="/dsa/problems" label="DSA Forge" />
        <SidebarLink to="/projects" label="Projects" />
        <SidebarLink to="/career" label="Career" />
        <SidebarLink to="/analytics" label="Analytics" />
        <SidebarLink to="/settings" label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
