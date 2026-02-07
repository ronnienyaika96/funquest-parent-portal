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

  const orders: Order[] = [];
  const isLoading = false;
  const error = null;

  return { orders, isLoading, error };
}
