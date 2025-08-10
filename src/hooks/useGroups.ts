import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, GroupMember, CreateGroupData } from '@/types/group';
import { useAuth } from './useAuth';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Buscar todos os grupos públicos e grupos do usuário
  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      console.error('Erro ao buscar grupos:', err);
      setError('Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  // Buscar grupos do usuário logado
  const fetchMyGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          groups (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const myGroupsData = data?.map(item => item.groups).filter(Boolean) as Group[];
      setMyGroups(myGroupsData || []);
    } catch (err) {
      console.error('Erro ao buscar meus grupos:', err);
      setError('Erro ao carregar meus grupos');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo grupo
  const createGroup = async (groupData: CreateGroupData): Promise<{ success: boolean; error?: string; group?: Group }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      // Criar o grupo
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          owner_id: user.id,
          is_private: groupData.is_private
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Adicionar o criador como membro com role 'owner'
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // Atualizar a lista de grupos
      await fetchGroups();
      await fetchMyGroups();

      return { success: true, group };
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      return { success: false, error: 'Erro ao criar grupo' };
    }
  };

  // Entrar em um grupo público
  const joinGroup = async (groupId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      // Atualizar a lista de grupos
      await fetchMyGroups();

      return { success: true };
    } catch (err) {
      console.error('Erro ao entrar no grupo:', err);
      return { success: false, error: 'Erro ao entrar no grupo' };
    }
  };

  // Sair de um grupo
  const leaveGroup = async (groupId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualizar a lista de grupos
      await fetchMyGroups();

      return { success: true };
    } catch (err) {
      console.error('Erro ao sair do grupo:', err);
      return { success: false, error: 'Erro ao sair do grupo' };
    }
  };

  // Deletar grupo (apenas owner)
  const deleteGroup = async (groupId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)
        .eq('owner_id', user.id);

      if (error) throw error;

      // Atualizar a lista de grupos
      await fetchGroups();
      await fetchMyGroups();

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar grupo:', err);
      return { success: false, error: 'Erro ao deletar grupo' };
    }
  };

  // Configurar Realtime para atualizações automáticas
  useEffect(() => {
    fetchGroups();
    fetchMyGroups();

    const channel = supabase
      .channel('groups_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, () => {
        fetchGroups();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, () => {
        fetchMyGroups();
      })
      .subscribe();

    // Polling a cada 5s
    const intervalId = setInterval(() => {
      fetchGroups();
      fetchMyGroups();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [user]);

  return {
    groups,
    myGroups,
    loading,
    error,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    fetchGroups,
    fetchMyGroups
  };
} 