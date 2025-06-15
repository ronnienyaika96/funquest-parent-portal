
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function AdminLoginForm({ onSuccess, onSwitchToRegister }: Props) {
  const { signIn, loading } = useAdminAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await signIn(form.email, form.password);
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          placeholder="Enter your admin email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={e => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an admin account?{' '}
          <Button variant="link" type="button" className="p-0" onClick={onSwitchToRegister}>
            Register
          </Button>
        </p>
      </div>
    </form>
  );
}
