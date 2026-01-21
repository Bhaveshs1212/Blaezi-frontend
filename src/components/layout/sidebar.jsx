import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100 px-6 py-8
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 lg:hidden text-gray-500 hover:text-gray-700"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[#6366F1] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Blaezi
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <SidebarLink to="/dashboard" label="Dashboard" onClick={onClose} />
          <SidebarLink to="/dsa" label="DSA Practice" onClick={onClose} />
          <SidebarLink to="/projects" label="Projects" onClick={onClose} />
          <SidebarLink to="/career" label="Career" onClick={onClose} />
          <SidebarLink to="/analytics" label="Analytics" onClick={onClose} />
          <SidebarLink to="/settings" label="Settings" onClick={onClose} />
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
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
