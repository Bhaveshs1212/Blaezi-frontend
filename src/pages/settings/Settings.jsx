import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Github } from 'lucide-react';

export default function Settings() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    githubUsername: user?.githubUsername || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updatedUser = await updateProfile(formData);
      setMessage('Profile updated successfully!');
      
      // Update AuthContext with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const merged = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      
      // Force context refresh by calling login with existing data
      // This ensures the user object in AuthContext is updated
      window.location.reload();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.response?.data?.message || 'Error updating profile');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p className="text-lg text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Manage your profile and preferences
        </p>
      </header>

      {/* Profile Card */}
      <div className="rounded-3xl bg-white border border-gray-100 p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <User className="w-6 h-6 text-[#6366F1]" />
          Profile Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div className={`px-6 py-4 rounded-2xl text-sm font-light ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-green-50 text-green-700 border border-green-100'
            }`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {message}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              placeholder="Your name"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            <p className="text-xs text-gray-500 mt-2 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email cannot be changed</p>
          </div>

          {/* GitHub Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Username
              </span>
            </label>
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              placeholder="yourusername"
            />
            <p className="text-xs text-gray-500 mt-2 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Used for GitHub integration and project syncing
            </p>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-[#6366F1] hover:bg-[#5558E3] text-white py-4 rounded-full"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>

      {/* Account Info Card */}
      <div className="rounded-3xl bg-white border border-gray-100 p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Account Information
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between text-base">
            <span className="text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Created</span>
            <span className="font-medium text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-gray-600 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User ID</span>
            <span className="font-mono text-xs text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {user?.id || user?._id || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
