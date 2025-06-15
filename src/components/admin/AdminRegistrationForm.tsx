
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function AdminRegistrationForm({ onSuccess, onSwitchToLogin }: Props) {
  const { signUp, loading } = useAdminAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    const { error } = await signUp(form.email, form.password, form.firstName, form.lastName);
    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Admin account created successfully.",
      });
      onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            placeholder="First name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            placeholder="Last name"
            required
          />
        </div>
      </div>
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
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={e => handleChange('password', e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={e => handleChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {isSubmitting ? 'Creating account...' : 'Create Admin Account'}
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an admin account?{' '}
          <Button
            variant="link"
            type="button"
            onClick={onSwitchToLogin}
            className="p-0"
          >
            Sign in
          </Button>
        </p>
      </div>
    </form>
  );
}
