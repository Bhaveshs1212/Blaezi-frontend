import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLocalError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('Unable to connect to server. Please check if the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold text-[#6366F1] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h2>
          <p className="text-base text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sign in to continue to Blaezi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(localError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {localError || error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6366F1] hover:bg-[#5558E3] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#6366F1] hover:text-[#5558E3] font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
