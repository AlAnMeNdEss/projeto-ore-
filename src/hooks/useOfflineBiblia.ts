import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface OfflineBibliaState {
  isOnline: boolean;
  isCached: boolean;
  cacheProgress: number;
  lastSync: Date | null;
}

export function useOfflineBiblia() {
  const [state, setState] = useState<OfflineBibliaState>({
    isOnline: navigator.onLine,
    isCached: false,
    cacheProgress: 0,
    lastSync: null
  });

  // Verificar status online/offline
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Verificar se há dados em cache
  useEffect(() => {
    checkCacheStatus();
  }, []);

  const checkCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cache = await caches.open('ore-plus-biblia-v3');
        const keys = await cache.keys();
        const hasBibliaData = keys.some(key => 
          key.url.includes('supabase') && key.url.includes('versiculos_biblia')
        );
        
        setState(prev => ({ 
          ...prev, 
          isCached: hasBibliaData,
          lastSync: hasBibliaData ? new Date() : null
        }));
      }
    } catch (error) {
      console.error('Erro ao verificar cache:', error);
    }
  };

  // Pré-carregar dados da Bíblia para cache offline
  const preloadBibliaData = async () => {
    if (!state.isOnline) {
      console.log('Offline: não é possível pré-carregar dados');
      return;
    }

    setState(prev => ({ ...prev, cacheProgress: 0 }));

    try {
      // Lista de livros principais para cache
      const livrosPrincipais = [
        'Gênesis', 'Êxodo', 'Salmos', 'Provérbios', 'Mateus', 'Marcos', 
        'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', 'Apocalipse'
      ];

      let progress = 0;
      const totalLivros = livrosPrincipais.length;

      for (const livro of livrosPrincipais) {
        // Buscar alguns capítulos de cada livro
        for (let capitulo = 1; capitulo <= Math.min(5, getCapitulosPorLivro(livro)); capitulo++) {
          try {
            // @ts-ignore
            const { data, error } = await supabase
              .from('versiculos_biblia')
              .select('*')
              .eq('livro', livro)
              .eq('capitulo', capitulo)
              .order('versiculo', { ascending: true });

            if (error) {
              console.error(`Erro ao carregar ${livro} ${capitulo}:`, error);
            }
          } catch (error) {
            console.error(`Erro ao carregar ${livro} ${capitulo}:`, error);
          }
        }

        progress += 1;
        setState(prev => ({ 
          ...prev, 
          cacheProgress: Math.round((progress / totalLivros) * 100) 
        }));
      }

      setState(prev => ({ 
        ...prev, 
        isCached: true,
        lastSync: new Date(),
        cacheProgress: 100
      }));

      console.log('✅ Dados da Bíblia pré-carregados para uso offline');
    } catch (error) {
      console.error('❌ Erro ao pré-carregar dados:', error);
      setState(prev => ({ ...prev, cacheProgress: 0 }));
    }
  };

  // Função auxiliar para obter número de capítulos por livro
  const getCapitulosPorLivro = (livro: string): number => {
    const capitulosPorLivro: Record<string, number> = {
      'Gênesis': 50, 'Êxodo': 40, 'Levítico': 27, 'Números': 36, 'Deuteronômio': 34,
      'Josué': 24, 'Juízes': 21, 'Rute': 4, '1 Samuel': 31, '2 Samuel': 24,
      '1 Reis': 22, '2 Reis': 25, '1 Crônicas': 29, '2 Crônicas': 36, 'Esdras': 10,
      'Neemias': 13, 'Ester': 10, 'Jó': 42, 'Salmos': 150, 'Provérbios': 31,
      'Eclesiastes': 12, 'Cânticos': 8, 'Isaías': 66, 'Jeremias': 52, 'Lamentações': 5,
      'Ezequiel': 48, 'Daniel': 12, 'Oseias': 14, 'Joel': 3, 'Amós': 9, 'Obadias': 1,
      'Jonas': 4, 'Miquéias': 7, 'Naum': 3, 'Habacuque': 3, 'Sofonias': 3, 'Ageu': 2,
      'Zacarias': 14, 'Malaquias': 4, 'Mateus': 28, 'Marcos': 16, 'Lucas': 24,
      'João': 21, 'Atos': 28, 'Romanos': 16, '1 Coríntios': 16, '2 Coríntios': 13,
      'Gálatas': 6, 'Efésios': 6, 'Filipenses': 4, 'Colossenses': 4, '1 Tessalonicenses': 5,
      '2 Tessalonicenses': 3, '1 Timóteo': 6, '2 Timóteo': 4, 'Tito': 3, 'Filemom': 1,
      'Hebreus': 13, 'Tiago': 5, '1 Pedro': 5, '2 Pedro': 3, '1 João': 5, '2 João': 1,
      '3 João': 1, 'Judas': 1, 'Apocalipse': 22
    };
    return capitulosPorLivro[livro] || 1;
  };

  return {
    ...state,
    preloadBibliaData,
    checkCacheStatus
  };
} 