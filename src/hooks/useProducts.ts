import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  created_at: string | null;
  updated_at: string | null;
  // UI aliases for existing components
  image?: string;
  shortDescription?: string;
  originalPrice?: number;
}

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('wc-products', {
        body: { per_page: 50 },
      });
      if (error) throw error;
      const list = Array.isArray(data) ? data : [];
      return list.map((product: any) => ({
        ...product,
        image: product.image_url || product.image || '/placeholder.svg',
        images: Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : [product.image_url || '/placeholder.svg'],
        shortDescription: product.shortDescription ?? product.short_description,
        originalPrice: product.originalPrice ?? product.original_price,
      })) as Product[];
    },
  });

  const getProductsByCategory = (category: string) => {
    return (
      products?.filter((product: Product) =>
        category === 'All' || product.category?.toLowerCase() === category.toLowerCase()
      ) || []
    );
  };

  const getProductById = (id: string) => {
    return products?.find((product: Product) => product.id === id);
  };

  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return products || [];
    const term = searchTerm.toLowerCase();
    return (
      products?.filter((product: Product) =>
        product.title.toLowerCase().includes(term) ||
        product.shortDescription?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      ) || []
    );
  };

  const getCategories = () => {
    if (!products) return ['All'];
    const categories = Array.from(new Set(products.map((p: Product) => p.category).filter(Boolean)));
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
