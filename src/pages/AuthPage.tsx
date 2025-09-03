
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { PasswordResetForm } from '../components/auth/PasswordResetForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authMode === 'login' && (
          <LoginForm
            type="parent"
            onLoginSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToReset={() => setAuthMode('reset')}
          />
        )}
        {authMode === 'signup' && (
          <SignupForm
            type="parent"
            onSignupSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'reset' && (
          <PasswordResetForm 
            onBack={() => setAuthMode('login')} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
