
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';

/**
 * Route guard for admin-only routes.
 * Handles loading, unauthenticated, and unauthorized state with clear early returns.
 */
interface AdminProtectedRouteProps {
  children: React.ReactNode;
}
const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAdminAuth();

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated as any user: redirect to admin login
  if (!user) {
    // It's important to use only <Navigate /> as the root render
    console.warn('[AdminProtectedRoute] User not authenticated. Redirecting to /admin/auth.');
    return <Navigate to="/admin/auth" replace />;
  }

  // Authenticated, but not an admin user: redirect & clear message
  if (!isAdmin) {
    // It's important to use only <Navigate /> as the root render
    console.warn('[AdminProtectedRoute] User is not admin. Redirecting to /admin/auth.');
    return <Navigate to="/admin/auth" replace />;
  }

  // User is authenticated and is an admin: allow access
  return <>{children}</>;
};

export default AdminProtectedRoute;

