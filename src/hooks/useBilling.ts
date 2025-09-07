import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
}

export function useBilling() {
  const { user } = useAuth();
  
  // Fetch real WooCommerce orders for billing history
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['woocommerce-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('woocommerce_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Convert orders to billing history format
  const billingHistory: BillingHistory[] = orders.map(order => ({
    id: order.id,
    date: new Date(order.created_at).toLocaleDateString(),
    description: `Order #${order.woo_order_id}`,
    amount: `$${order.total?.toFixed(2) || '0.00'}`,
    status: order.status === 'completed' ? 'paid' : 
            order.status === 'processing' ? 'pending' : 'failed',
    invoice: `INV-${order.woo_order_id}`
  }));

  // Mock payment methods for now - in real app, integrate with Stripe/WooCommerce
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true
    }
  ]);

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({ 
        ...method, 
        isDefault: method.id === id 
      }))
    );
  };

  const downloadInvoice = async (invoice: string) => {
    // In real app, generate/download PDF invoice
    try {
      // Mock PDF generation
      const blob = new Blob([`Invoice ${invoice} - Generated on ${new Date().toLocaleDateString()}`], {
        type: 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Invoice download error:', error);
      throw new Error('Failed to download invoice');
    }
  };

  return {
    billingHistory,
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    downloadInvoice,
    isLoading: ordersLoading
  };
}