
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminRegistrationForm } from '@/components/admin/AdminRegistrationForm';

const AdminAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Admin Login' : 'Admin Registration'}
            </CardTitle>
            <p className="text-gray-600">Access the FunQuest Admin Dashboard</p>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <AdminLoginForm
                onSuccess={() => navigate('/admin')}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <AdminRegistrationForm
                onSuccess={() => { setIsLogin(true); }}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuthPage;
