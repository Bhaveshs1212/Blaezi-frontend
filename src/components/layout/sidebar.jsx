import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 px-6 py-8">
      {/* Brand */}
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-[#6366F1] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Blaezi
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <SidebarLink to="/dashboard" label="Dashboard" />
        <SidebarLink to="/dsa" label="DSA Practice" />
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
        `flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-[#6366F1] text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {label}
    </NavLink>
  );
}
