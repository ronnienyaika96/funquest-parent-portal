import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useChildProfiles } from './useChildProfiles';
import { useTracingProgress } from './useTracingProgress';

export function useQuickStats() {
  const { user } = useAuth();
  const { children } = useChildProfiles();
  const { getProgressStats } = useTracingProgress();
  
  // Get orders for calculating printables and activities
  const { data: orders } = useQuery({
    queryKey: ['woo-orders-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('woocommerce_orders')
        .select('id, created_at, total, status, line_items')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const progressStats = getProgressStats();
  const childrenCount = children?.length || 0;
  
  // Calculate stats from real data
  const completedActivities = progressStats.completed || 0;
  const totalOrders = orders?.length || 0;
  const printableDownloads = orders?.reduce((acc: number, order: any) => {
    const items = Array.isArray(order.line_items) ? order.line_items : [];
    const count = items.filter((item: any) => {
      const title = String(item.name ?? '').toLowerCase();
      return title.includes('printable') || title.includes('coloring');
    }).length;
    return acc + count;
  }, 0) || 0;

  const stats = [
    {
      title: 'Active Children',
      value: childrenCount.toString(),
      icon: '👧👦',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: childrenCount > 0 ? `${childrenCount} registered` : 'Add your first child'
    },
    {
      title: 'Letters Completed',
      value: completedActivities.toString(),
      icon: '🎯',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      change: `${progressStats.percentage}% alphabet`
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: '📦',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: totalOrders > 0 ? 'Great start!' : 'Visit our shop'
    },
    {
      title: 'Printables Downloaded',
      value: printableDownloads.toString(),
      icon: '🖨️',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: printableDownloads > 0 ? 'Keep learning!' : 'Explore printables'
    }
  ];

  return { stats, isLoading: false };
}