import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Versiculo {
  id: number;
  livro: string;
  capitulo: number;
  versiculo: string;
  texto: string;
}

export function useOfflineBiblia() {
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar mudanças de conectividade
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para salvar versículos no cache
  const salvarNoCache = (versiculos: Versiculo[]) => {
    try {
      localStorage.setItem('bibliaCache', JSON.stringify(versiculos));
      localStorage.setItem('bibliaCacheTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Erro ao salvar no cache:', error);
    }
  };

  // Função para carregar do cache
  const carregarDoCache = (livro: string, capitulo: number): Versiculo[] => {
    try {
      const cache = localStorage.getItem('bibliaCache');
      if (!cache) return [];

      const versiculosCache: Versiculo[] = JSON.parse(cache);
      return versiculosCache.filter(
        v => v.livro === livro && v.capitulo === capitulo
      );
    } catch (error) {
      console.error('Erro ao carregar do cache:', error);
      return [];
    }
  };

  // Função para buscar versículos (online ou offline)
  const buscarVersiculos = async (livro: string, capitulo: number) => {
    setLoading(true);
    setErro('');

    try {
      // Se estiver online, busca do Supabase
      if (isOnline) {
        const { data, error } = await supabase
          .from('versiculos_biblia')
          .select('*')
          .eq('livro', livro)
          .eq('capitulo', capitulo)
          .order('versiculo', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setVersiculos(data);
          // Salva no cache para uso offline
          salvarNoCache(data);
          return;
        }
      }

      // Se estiver offline ou não encontrou online, tenta do cache
      const versiculosCache = carregarDoCache(livro, capitulo);
      
      if (versiculosCache.length > 0) {
        setVersiculos(versiculosCache);
        if (!isOnline) {
          setErro('Modo offline - dados do cache local');
        }
        return;
      }

      // Se não encontrou nem online nem no cache
      setErro('Nenhum versículo encontrado para este livro e capítulo.');
      setVersiculos([]);

    } catch (error) {
      console.error('Erro ao carregar versículos:', error);
      
      // Tenta do cache em caso de erro
      const versiculosCache = carregarDoCache(livro, capitulo);
      if (versiculosCache.length > 0) {
        setVersiculos(versiculosCache);
        setErro('Erro de conexão - usando dados do cache local');
      } else {
        setErro('Erro ao carregar versículos.');
        setVersiculos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar cache
  const limparCache = () => {
    try {
      localStorage.removeItem('bibliaCache');
      localStorage.removeItem('bibliaCacheTimestamp');
      console.log('Cache limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  };

  // Função para verificar tamanho do cache
  const getCacheInfo = () => {
    try {
      const cache = localStorage.getItem('bibliaCache');
      const timestamp = localStorage.getItem('bibliaCacheTimestamp');
      
      if (!cache) return { size: 0, timestamp: null };
      
      const size = new Blob([cache]).size;
      const date = timestamp ? new Date(parseInt(timestamp)) : null;
      
      return { size, timestamp: date };
    } catch (error) {
      console.error('Erro ao verificar cache:', error);
      return { size: 0, timestamp: null };
    }
  };

  return {
    versiculos,
    loading,
    erro,
    isOnline,
    buscarVersiculos,
    limparCache,
    getCacheInfo
  };
} 