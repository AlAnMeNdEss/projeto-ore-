import { useAuth } from '@/hooks/useAuth';
import { User as UserIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Estado para armazenar os números reais
  const [oracoesFeitas, setOracoesFeitas] = useState<number>(0);
  const [oracoesRecebidas, setOracoesRecebidas] = useState<number>(0);
  const [pedidos, setPedidos] = useState<number>(0);
  const [oracoesHoje, setOracoesHoje] = useState<number>(0);
  const [mediaOracoesPorPedido, setMediaOracoesPorPedido] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [pedidosRecentes, setPedidosRecentes] = useState<any[]>([]);
  const [oracoesRecentes, setOracoesRecentes] = useState<any[]>([]);
  const [diasAtivo, setDiasAtivo] = useState<number>(0);
  const [categoriaMaisUsada, setCategoriaMaisUsada] = useState<string>('');
  const [mensagensRecebidas, setMensagensRecebidas] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    
    console.log('Debug - Iniciando busca de estatísticas para usuário:', user.id);
    console.log('Debug - Timestamp:', new Date().toISOString());
    
    try {
      // Teste inicial: verificar se há dados na tabela
      const { data: testData, error: testError } = await supabase
        .from('prayer_requests')
        .select('count')
        .limit(1);
      
      console.log('Debug - Teste de conexão:', { testData, testError });
      
      // Verificar se há dados na tabela de interações
      const { data: testInteractions, error: testInteractionsError } = await supabase
        .from('prayer_interactions')
        .select('count')
        .limit(1);
      
      console.log('Debug - Teste de interações:', { testInteractions, testInteractionsError });
      
      // Verificar todos os pedidos na tabela (para debug)
      const { data: allPedidos, error: allPedidosError } = await supabase
        .from('prayer_requests')
        .select('id, user_id, prayer_count, created_at')
        .limit(10);
      
      console.log('Debug - Todos os pedidos (primeiros 10):', allPedidos);
      console.log('Debug - Erro ao buscar todos os pedidos:', allPedidosError);
      
      // Verificar todas as interações (para debug)
      const { data: allInteractions, error: allInteractionsError } = await supabase
        .from('prayer_interactions')
        .select('id, user_id, prayer_request_id, created_at')
        .limit(10);
      
      console.log('Debug - Todas as interações (primeiras 10):', allInteractions);
      console.log('Debug - Erro ao buscar todas as interações:', allInteractionsError);
      
      // Data de hoje no formato YYYY-MM-DD
      const hoje = new Date().toISOString().slice(0, 10);
      
      // Calcular dias ativo
      const dataCadastro = new Date(user.created_at);
      const hojeDate = new Date();
      const diffTime = Math.abs(hojeDate.getTime() - dataCadastro.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDiasAtivo(diffDays);
      
      // Buscar orações feitas pelo usuário
      const { count: oracoesFeitasCount, error } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!error && typeof oracoesFeitasCount === 'number') {
        setOracoesFeitas(oracoesFeitasCount);
        console.log('Debug - Orações feitas:', oracoesFeitasCount);
      }
      
      // Buscar orações feitas hoje pelo usuário
      const { count: oracoesHojeCount, error: errorHoje } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', `${hoje}T00:00:00.000Z`)
        .lte('created_at', `${hoje}T23:59:59.999Z`);
      if (!errorHoje && typeof oracoesHojeCount === 'number') {
        setOracoesHoje(oracoesHojeCount);
        console.log('Debug - Orações hoje:', oracoesHojeCount);
      }
      
      // Buscar pedidos criados pelo usuário e suas orações recebidas
      console.log('Debug - User ID:', user.id);

      // Query simplificada para testar
      const { data: pedidosData, error: errorPedidos } = await supabase
        .from('prayer_requests')
        .select('id, prayer_count, user_id, text, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Debug - Pedidos do usuário:', pedidosData);
      console.log('Debug - Erro na busca de pedidos:', errorPedidos);

      if (!errorPedidos && Array.isArray(pedidosData)) {
        const totalPedidos = pedidosData.length;
        const totalRecebidas = pedidosData.reduce((acc, p) => acc + (p.prayer_count || 0), 0);
        
        console.log('Debug - Total de pedidos:', totalPedidos);
        console.log('Debug - Total de orações recebidas:', totalRecebidas);
        console.log('Debug - Detalhes dos pedidos:', pedidosData);
        
        setPedidos(totalPedidos);
        setOracoesRecebidas(totalRecebidas);
        setPedidosRecentes(pedidosData.slice(0, 3)); // Últimos 3 pedidos
        
        // Calcular categoria mais usada
        const categorias = pedidosData.map(p => p.category).filter(Boolean);
        if (categorias.length > 0) {
          const categoriaCount = categorias.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const categoriaMaisFrequente = Object.entries(categoriaCount)
            .sort(([,a], [,b]) => b - a)[0][0];
          setCategoriaMaisUsada(categoriaMaisFrequente);
        }
        
        // Calcular média
        if (totalPedidos > 0) {
          const media = Math.round(totalRecebidas / totalPedidos);
          setMediaOracoesPorPedido(media);
        } else {
          setMediaOracoesPorPedido(0);
        }

        // Buscar mensagens recebidas nos pedidos do usuário
        if (pedidosData.length > 0) {
          const pedidoIds = pedidosData.map(p => p.id);
          try {
            const { data: mensagensData, error: errorMensagens } = await supabase
              .from('prayer_messages' as any)
              .select(`
                id,
                message,
                created_at,
                user_id,
                prayer_request_id,
                profiles:user_id(name, email)
              `)
              .in('prayer_request_id', pedidoIds)
              .order('created_at', { ascending: false })
              .limit(10);

            if (!errorMensagens && mensagensData) {
              setMensagensRecebidas(mensagensData);
              console.log('Debug - Mensagens recebidas:', mensagensData);
            }
          } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            setMensagensRecebidas([]);
          }
        }
      } else {
        console.error('Erro ao buscar pedidos:', errorPedidos);
        setPedidos(0);
        setOracoesRecebidas(0);
        setMediaOracoesPorPedido(0);
      }

      // Query alternativa simplificada
      if (Array.isArray(pedidosData) && pedidosData.length > 0) {
        const pedidoIds = pedidosData.map(p => p.id);
        console.log('Debug - IDs dos pedidos:', pedidoIds);
        
        const { data: oracoesData, error: errorOracoes } = await supabase
          .from('prayer_interactions')
          .select('id, prayer_request_id, created_at')
          .in('prayer_request_id', pedidoIds)
          .order('created_at', { ascending: false });
        
        console.log('Debug - Orações encontradas:', oracoesData);
        console.log('Debug - Erro na busca de orações:', errorOracoes);
        
        if (!errorOracoes && Array.isArray(oracoesData)) {
          const totalOracoesReal = oracoesData.length;
          console.log('Debug - Total real de orações:', totalOracoesReal);
          setOracoesRecebidas(totalOracoesReal);
          setOracoesRecentes(oracoesData.slice(0, 5)); // Últimas 5 orações
          
          if (pedidosData.length > 0) {
            const media = Math.round(totalOracoesReal / pedidosData.length);
            setMediaOracoesPorPedido(media);
          }
        }
      }
      
      setLastUpdate(new Date());
      console.log('Debug - Atualização concluída:', new Date().toISOString());
      
    } catch (error) {
      console.error('Debug - Erro geral na busca de estatísticas:', error);
    }
    
    setLoadingStats(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  // Atualizar a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Debug - Atualização automática iniciada');
      fetchStats();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  // Valores para os cards de atividade
  const stats = {
    oracoesFeitas,
    oracoesRecebidas,
    pedidos,
    oracoesHoje,
    mediaOracoesPorPedido,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ede9fe] to-[#a78bfa]">
        <div className="bg-white/80 rounded-2xl p-8 shadow-xl text-center">
          <UserIcon className="w-16 h-16 mx-auto text-[#8b5cf6] mb-4" />
          <div className="text-lg font-semibold text-[#8b5cf6] mb-2">Você não está logado.</div>
          <a href="/" className="text-[#7c3aed] underline">Voltar para o início</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col">
      {/* Topo fixo */}
      <div className="sticky top-0 left-0 right-0 z-30 bg-[#23232b]/90 backdrop-blur flex items-center px-4 py-4 shadow-sm border-b border-[#18181b]">
        <button onClick={() => navigate('/')} className="p-2 mr-2 rounded-full hover:bg-[#23232b] transition">
          <ArrowLeft className="w-6 h-6 text-gray-200" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-gray-100 -ml-8">O Meu Perfil</h2>
        <div style={{width: 40}} /> {/* Espaço para equilibrar o layout */}
      </div>
      {/* Conteúdo do perfil */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 w-full">
        {/* Informações do usuário */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#23232b] flex items-center justify-center text-4xl font-bold text-gray-100 shadow-lg mb-2 border border-[#18181b]">
            {user.email?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <div className="text-xl font-bold text-gray-100 mb-1">{user.user_metadata?.name || 'Usuário'}</div>
          <div className="text-base text-gray-400 mb-2">{user.email}</div>
          <div className="text-sm text-gray-500">Membro há {diasAtivo} dias</div>
        </div>

        {/* Informações técnicas */}
        <div className="bg-[#27272a] rounded-lg p-4 mb-6 text-left text-gray-100 shadow-inner w-full max-w-md border border-[#23232b]">
          <div className="mb-2"><span className="font-semibold">ID:</span> <span className="break-all text-sm">{user.id}</span></div>
          <div className="mb-2"><span className="font-semibold">Data de cadastro:</span> {formatDate(user.created_at)}</div>
          <div className="mb-2"><span className="font-semibold">Última atualização:</span> {lastUpdate.toLocaleTimeString()}</div>
          {categoriaMaisUsada && (
            <div className="mb-2"><span className="font-semibold">Categoria mais usada:</span> {categoriaMaisUsada}</div>
          )}
        </div>

        {/* Cards de atividade melhorados */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-100">A Minha Atividade</h3>
            <button 
              onClick={fetchStats}
              disabled={loadingStats}
              className="px-3 py-1 text-sm bg-[#23232b] text-gray-300 rounded-lg hover:bg-[#18181b] transition disabled:opacity-50"
            >
              {loadingStats ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#27272a] rounded-xl flex flex-col items-center justify-center py-6 shadow text-gray-100 border border-[#23232b]">
              <span className="text-3xl font-extrabold">{loadingStats ? '...' : stats.oracoesFeitas}</span>
              <span className="text-base font-medium mt-1">Orações Feitas</span>
            </div>
            <div className="bg-[#27272a] rounded-xl flex flex-col items-center justify-center py-6 shadow text-gray-100 border border-[#23232b]">
              <span className="text-3xl font-extrabold">{loadingStats ? '...' : stats.oracoesRecebidas}</span>
              <span className="text-base font-medium mt-1">Orações Recebidas</span>
            </div>
            <div className="bg-[#27272a] rounded-xl flex flex-col items-center justify-center py-6 shadow text-gray-100 border border-[#23232b]">
              <span className="text-3xl font-extrabold">{loadingStats ? '...' : stats.pedidos}</span>
              <span className="text-base font-medium mt-1">Pedidos Criados</span>
            </div>
            <div className="bg-[#27272a] rounded-xl flex flex-col items-center justify-center py-6 shadow text-gray-100 border border-[#23232b]">
              <span className="text-3xl font-extrabold">{loadingStats ? '...' : stats.oracoesHoje}</span>
              <span className="text-base font-medium mt-1">Orações Hoje</span>
            </div>
          </div>
          
          {/* Card adicional com estatísticas detalhadas */}
          <div className="mt-4 bg-[#27272a] rounded-xl p-4 shadow text-gray-100 border border-[#23232b]">
            <h4 className="text-base font-semibold mb-3 text-center">Estatísticas Detalhadas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Média de orações por pedido:</span>
                <span className="font-semibold">{loadingStats ? '...' : stats.mediaOracoesPorPedido}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de interações:</span>
                <span className="font-semibold">{loadingStats ? '...' : stats.oracoesFeitas + stats.oracoesRecebidas}</span>
              </div>
              <div className="flex justify-between">
                <span>Pedidos ativos:</span>
                <span className="font-semibold">{loadingStats ? '...' : stats.pedidos}</span>
              </div>
              <div className="flex justify-between">
                <span>Dias como membro:</span>
                <span className="font-semibold">{diasAtivo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pedidos recentes */}
        {pedidosRecentes.length > 0 && (
          <div className="w-full max-w-md mb-6">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Meus Pedidos Recentes</h3>
            <div className="space-y-3">
              {pedidosRecentes.map((pedido, index) => (
                <div key={pedido.id} className="bg-[#27272a] rounded-lg p-3 shadow text-gray-100 border border-[#23232b]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">Pedido #{index + 1}</span>
                    <span className="text-sm text-gray-400">{formatDate(pedido.created_at)}</span>
                  </div>
                  <p className="text-sm mb-2 line-clamp-2">{pedido.text}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{pedido.category}</span>
                    <span className="text-sm font-semibold">🙏 {pedido.prayer_count || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagens recebidas nos pedidos */}
        {mensagensRecebidas.length > 0 && (
          <div className="w-full max-w-md mb-6">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Minhas Mensagens Recebidas</h3>
            <div className="space-y-3">
              {mensagensRecebidas.map((mensagem, index) => (
                <div key={mensagem.id} className="bg-[#27272a] rounded-lg p-3 shadow text-gray-100 border border-[#23232b]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">Mensagem #{index + 1}</span>
                    <span className="text-sm text-gray-400">{formatDate(mensagem.created_at)}</span>
                  </div>
                  <p className="text-sm mb-2 line-clamp-2">{mensagem.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">De: {mensagem.profiles?.name || mensagem.profiles?.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={signOut}
          className="mt-2 px-6 py-2 rounded-xl bg-[#27272a] text-gray-100 font-semibold shadow-md hover:bg-[#23232b] transition-all duration-200 w-full max-w-md border border-[#23232b]"
        >
          Sair do app
        </button>
      </div>
    </div>
  );
}