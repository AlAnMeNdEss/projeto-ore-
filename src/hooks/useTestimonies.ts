import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Testimony {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    email?: string;
    user_metadata?: {
      name?: string;
    };
  };
}

export function useTestimonies() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('testimonies')
        .select(`
          *,
          user:user_id(
            email,
            user_metadata
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar testemunhos:', error);
        setError('Erro ao carregar testemunhos');
        return;
      }

      setTestimonies(data || []);
    } catch (err) {
      console.error('Erro ao buscar testemunhos:', err);
      setError('Erro ao carregar testemunhos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();

    // Configurar Realtime para atualizações
    const channel = supabase
      .channel('testimonies_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonies'
        },
        () => {
          fetchTestimonies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteTestimony = async (testimonyId: string) => {
    try {
      const { error } = await supabase
        .from('testimonies')
        .delete()
        .eq('id', testimonyId);

      if (error) {
        console.error('Erro ao deletar testemunho:', error);
        throw error;
      }

      // Atualizar a lista local
      setTestimonies(prev => prev.filter(t => t.id !== testimonyId));
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar testemunho:', err);
      return { success: false, error: err };
    }
  };

  return {
    testimonies,
    loading,
    error,
    refreshTestimonies: fetchTestimonies,
    deleteTestimony
  };
} 