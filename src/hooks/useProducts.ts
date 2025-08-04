import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  short_description?: string;
  long_description?: string;
  price: number;
  original_price?: number;
  category: string;
  badge?: string;
  image_url?: string;
  images?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const queryClient = useQueryClient();

  // Fetch all active products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      return (data || []).map(product => ({
        ...product,
        image: product.image_url || '/placeholder.svg',
        images: Array.isArray(product.images) ? product.images : [product.image_url || '/placeholder.svg'],
      }));
    },
  });

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products?.filter(product => 
      category === 'All' || product.category.toLowerCase() === category.toLowerCase()
    ) || [];
  };

  // Get product by ID
  const getProductById = (id: string) => {
    return products?.find(product => product.id === id);
  };

  // Search products
  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return products || [];
    
    const term = searchTerm.toLowerCase();
    return products?.filter(product =>
      product.title.toLowerCase().includes(term) ||
      product.short_description?.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    ) || [];
  };

  // Get categories
  const getCategories = () => {
    if (!products) return ['All'];
    
    const categories = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...categories];
  };

  return {
    products,
    isLoading,
    error,
    getProductsByCategory,
    getProductById,
    searchProducts,
    getCategories,
  };
}