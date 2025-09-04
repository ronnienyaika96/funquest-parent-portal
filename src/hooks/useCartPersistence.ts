import { useEffect } from 'react';
import { useAuth } from './useAuth';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCartPersistence() {
  const { user } = useAuth();

  // Save cart to localStorage with user-specific key
  const saveCart = (items: CartItem[]) => {
    const key = user?.id ? `cart_${user.id}` : 'guest_cart';
    localStorage.setItem(key, JSON.stringify(items));
  };

  // Load cart from localStorage
  const loadCart = (): CartItem[] => {
    try {
      const key = user?.id ? `cart_${user.id}` : 'guest_cart';
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Clear cart
  const clearCart = () => {
    const key = user?.id ? `cart_${user.id}` : 'guest_cart';
    localStorage.removeItem(key);
  };

  // Migrate guest cart to user cart on login
  const migrateGuestCart = () => {
    if (user?.id) {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        const userKey = `cart_${user.id}`;
        const existingUserCart = localStorage.getItem(userKey);
        
        if (!existingUserCart) {
          // Transfer guest cart to user
          localStorage.setItem(userKey, guestCart);
        }
        // Clear guest cart
        localStorage.removeItem('guest_cart');
      }
    }
  };

  // Auto-migrate cart when user logs in
  useEffect(() => {
    migrateGuestCart();
  }, [user?.id]);

  return {
    saveCart,
    loadCart,
    clearCart,
    migrateGuestCart
  };
}