import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useWooOrderStatus(orderId?: number | string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['woo-order-status', orderId],
    enabled: enabled && Boolean(orderId),
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('wc-get-order', {
        body: { order_id: orderId },
      });
      if (error) throw error;
      return data as { id: number; status: string; total: string; currency: string };
    },
    refetchInterval: (data) => {
      // Poll faster until order reaches a terminal state
      const status = (data as any)?.status;
      const isDone = ['processing', 'completed', 'cancelled', 'refunded', 'failed'].includes(status);
      return isDone ? false : 3000;
    },
  });
}
