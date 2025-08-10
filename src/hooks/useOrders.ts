import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderItem {
  id: string;
  product_id: string | null;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  total: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export function useOrders() {
  const { user } = useAuth();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['woo-orders', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('woocommerce_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((o: any) => {
        const items = Array.isArray(o.line_items)
          ? o.line_items.map((li: any, idx: number) => ({
              id: String(li.id ?? idx),
              product_id: li.product_id ?? null,
              title: li.name ?? 'Item',
              price: Number(li.price ?? li.total ?? 0),
              quantity: Number(li.quantity ?? 0),
            }))
          : [];
        return {
          id: o.id,
          user_id: o.user_id ?? null,
          total: Number(o.total ?? 0),
          status: o.status ?? 'pending',
          created_at: o.created_at,
          order_items: items,
        } as Order;
      });
    },
  });

  return { orders, isLoading, error };
}
