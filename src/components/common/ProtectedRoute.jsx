import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

let renderCount = 0;

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  renderCount++;
  console.log(`[ProtectedRoute] RENDER #${renderCount} - loading: ${loading}, isAuthenticated: ${isAuthenticated}`);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}
