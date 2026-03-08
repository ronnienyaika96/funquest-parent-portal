import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  plan: string | null;
  slug: string | null;
  audience: string | null;
  billing_period: string | null;
  price: number | null;
  currency: string | null;
  description: string | null;
  features: string[];
  max_child_profiles: number | null;
  games_per_day: number | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  sort_order: number | null;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_id: string;
  status: string;
  billing_period: string | null;
  started_at: string | null;
  ends_at: string | null;
}

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

export function useSubscriptionPlans(audience?: string) {
  return useQuery({
    queryKey: ['subscription_plans', audience],
    queryFn: async () => {
      let q = supabase
        .from('subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (audience) q = q.eq('audience', audience);

      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map((d: any) => ({
        ...d,
        features: parseFeatures(d.features),
      })) as SubscriptionPlan[];
    },
  });
}

export function useAllSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription_plans_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).map((d: any) => ({
        ...d,
        features: parseFeatures(d.features),
      })) as SubscriptionPlan[];
    },
  });
}

export function useUserSubscription() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_subscription', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .maybeSingle();
      if (error) throw error;
      return data as UserSubscription | null;
    },
    enabled: !!user,
  });
}

export function useSubscribeToPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ subscriptionId, billingPeriod }: { subscriptionId: string; billingPeriod: string }) => {
      if (!user?.id) throw new Error('Must be logged in');

      // Deactivate existing
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Insert new
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          subscription_id: subscriptionId,
          billing_period: billingPeriod,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_subscription'] });
      toast({ title: 'Subscription updated!', description: 'Your plan has been changed successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Subscription failed', description: err.message, variant: 'destructive' });
    },
  });
}

export function useAdminSubscriptionMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['subscription_plans'] });
    queryClient.invalidateQueries({ queryKey: ['subscription_plans_all'] });
  };

  const createPlan = useMutation({
    mutationFn: async (plan: Partial<SubscriptionPlan>) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({ ...plan, features: JSON.stringify(plan.features || []) } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast({ title: 'Plan created' }); },
    onError: (e: Error) => { toast({ title: 'Error', description: e.message, variant: 'destructive' }); },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...plan }: Partial<SubscriptionPlan> & { id: string }) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({ ...plan, features: JSON.stringify(plan.features || []) } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'Plan updated' }); },
    onError: (e: Error) => { toast({ title: 'Error', description: e.message, variant: 'destructive' }); },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'Plan deleted' }); },
    onError: (e: Error) => { toast({ title: 'Error', description: e.message, variant: 'destructive' }); },
  });

  return { createPlan, updatePlan, deletePlan };
}
