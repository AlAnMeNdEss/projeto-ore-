import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PrayerRequest, PrayerCategory } from '@/types/prayer';
import { useToast } from '@/hooks/use-toast';

export function usePrayerRequests() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as PrayerRequest[]);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os pedidos de oração."
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (
    text: string, 
    category: PrayerCategory, 
    name?: string, 
    userId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          text,
          category,
          name: name || null,
          user_id: userId || null
        });

      if (error) throw error;

      toast({
        title: "Pedido enviado!",
        description: "Seu pedido de oração foi compartilhado com amor."
      });

      fetchRequests(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error creating prayer request:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar seu pedido."
      });
      return { success: false };
    }
  };

  const prayForRequest = async (requestId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('increment_prayer_count', {
          request_id: requestId,
          user_id: userId
        });

      if (error) throw error;

      if (data) {
        toast({
          title: "🙏 Oração registrada",
          description: "Sua oração foi contabilizada com carinho."
        });
        fetchRequests(); // Refresh to show updated count
      } else {
        toast({
          title: "Já orou por este pedido",
          description: "Você já registrou sua oração para este pedido."
        });
      }

      return { success: data };
    } catch (error) {
      console.error('Error praying for request:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar sua oração."
      });
      return { success: false };
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Pedido removido",
        description: "Seu pedido foi removido com sucesso."
      });

      fetchRequests(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o pedido."
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up realtime subscription
    const channel = supabase
      .channel('prayer_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prayer_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    requests,
    loading,
    createRequest,
    prayForRequest,
    deleteRequest,
    refreshRequests: fetchRequests
  };
}