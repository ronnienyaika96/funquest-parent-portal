import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Printable {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  pages: number;
  downloads: number;
  rating: number;
  preview_url?: string;
  file_url: string;
  featured: boolean;
  age_range?: string;
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export function usePrintables() {
  const queryClient = useQueryClient();

  // Fetch all active printables
  const {
    data: printables,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['printables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('printables')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Printable[];
    },
  });

  // Get printables by category
  const getPrintablesByCategory = (category: string) => {
    return printables?.filter(printable => 
      category === 'All' || printable.category === category
    ) || [];
  };

  // Get printable by ID
  const getPrintableById = (id: string) => {
    return printables?.find(printable => printable.id === id);
  };

  // Search printables
  const searchPrintables = (searchTerm: string) => {
    if (!searchTerm.trim()) return printables || [];
    
    const term = searchTerm.toLowerCase();
    return printables?.filter(printable =>
      printable.title.toLowerCase().includes(term) ||
      printable.description?.toLowerCase().includes(term) ||
      printable.category.toLowerCase().includes(term) ||
      printable.tags?.some(tag => tag.toLowerCase().includes(term))
    ) || [];
  };

  // Get categories
  const getCategories = () => {
    if (!printables) return ['All'];
    
    const categories = Array.from(new Set(printables.map(p => p.category)));
    return ['All', ...categories];
  };

  // Increment download count
  const incrementDownloads = useMutation({
    mutationFn: async (printableId: string) => {
      const { error } = await supabase
        .from('printables')
        .update({ downloads: printables?.find(p => p.id === printableId)?.downloads + 1 || 1 })
        .eq('id', printableId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printables'] });
    },
  });

  return {
    printables,
    isLoading,
    error,
    getPrintablesByCategory,
    getPrintableById,
    searchPrintables,
    getCategories,
    incrementDownloads,
  };
}