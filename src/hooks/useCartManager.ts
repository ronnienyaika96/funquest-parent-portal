import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCartPersistence } from './useCartPersistence';
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
  const { saveCart, loadCart, clearCart: clearPersistedCart } = useCartPersistence();

  // Load cart on mount
  useEffect(() => {
    const savedCart = loadCart();
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, [user?.id]);

  // Save cart whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart, saveCart]);

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
    clearPersistedCart();
  };

  const processCheckout = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return false;
    }
    if (cart.length === 0) {
      toast.error('Add items to your cart first');
      return false;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('wc-create-order', {
        body: {
          items: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
          user_id: user.id,
        },
      });

      if (error) throw error;

      if (data?.checkout_url) {
        toast.success('Redirecting to checkout...');
        window.location.href = data.checkout_url;
        return true;
      } else {
        throw new Error(data?.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
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