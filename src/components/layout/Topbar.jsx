import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    navigate('/settings');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8">
      <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Track your progress, build your future
      </p>
      
      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              {/* Avatar with initials */}
              <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-sm font-medium">
                {getInitials(user.name || user.email)}
              </div>
              
              {/* User name */}
              <span className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user.name || user.email}
              </span>
              
              {/* Dropdown icon */}
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-14 bg-white border border-gray-100 rounded-2xl shadow-sm py-2 z-50 min-w-[240px]">
                {/* User info */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.name}</p>
                  <p className="text-xs text-gray-500 font-light mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.email}</p>
                </div>

                {/* Settings */}
                <button
                  onClick={handleSettings}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 font-medium"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 text-red-600 font-medium border-t border-gray-100"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
