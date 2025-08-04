import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCartManager() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const addToCart = (product: any, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.image_url
      }];
    });
    toast.success(`${product.title} added to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart => prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const processCheckout = async () => {
    if (!user || cart.length === 0) {
      toast.error('Please login and add items to cart');
      return false;
    }

    setIsProcessing(true);
    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          items: cart,
          user_id: user.id,
          total_amount: total
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Order processed successfully!');
        clearCart();
        return true;
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return {
    cart,
    addToCart,
    updateCartQuantity,
    clearCart,
    processCheckout,
    cartTotal,
    cartItemCount,
    isProcessing
  };
}