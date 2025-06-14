
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAdminAuth();

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

  if (!user) {
    // Not authenticated as any user
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600 font-bold mb-2">You must be logged in as an admin to access this page.</p>
          <Navigate to="/admin/auth" replace />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Authenticated, but not an admin user
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600 font-bold mb-2">Access denied: Only admin users can access the admin dashboard.</p>
          <p className="text-gray-600">If you believe this is a mistake, please contact support.</p>
          <Navigate to="/admin/auth" replace />
        </div>
      </div>
    );
  }

  // User is authenticated and is an admin
  return <>{children}</>;
};

export default AdminProtectedRoute;
