import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminAuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check if user is admin, then redirect
      const checkAdmin = async () => {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (data) {
          navigate('/admin', { replace: true });
        }
      };
      checkAdmin();
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      // Verify admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        toast({ title: 'Access Denied', description: 'This login is for administrators only.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      toast({ title: 'Welcome, Admin! 🛡️', description: 'Redirecting to admin panel.' });
      navigate('/admin', { replace: true });
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-1">Sign in to access the admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 rounded-xl bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg py-6 shadow-lg shadow-emerald-500/25"
            >
              {loading ? 'Verifying...' : 'Sign In as Admin'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            This portal is restricted to authorized administrators only.
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-4">
          <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to home
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminAuthPage;
