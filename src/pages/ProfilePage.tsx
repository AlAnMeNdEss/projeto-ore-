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
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoadingStats(true);
      // Buscar orações feitas
      const { count, error } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!error && typeof count === 'number') {
        setOracoesFeitas(count);
      }
      // Buscar pedidos criados pelo usuário
      const { data: pedidosData, count: pedidosCount, error: errorPedidos } = await supabase
        .from('prayer_requests')
        .select('prayer_count', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!errorPedidos) {
        setPedidos(typeof pedidosCount === 'number' ? pedidosCount : 0);
        // Soma das orações recebidas
        if (Array.isArray(pedidosData)) {
          const totalRecebidas = pedidosData.reduce((acc, p) => acc + (p.prayer_count || 0), 0);
          setOracoesRecebidas(totalRecebidas);
        }
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, [user]);

  // Valores fictícios para os outros cards
  const stats = {
    oracoesFeitas,
    oracoesRecebidas,
    pedidos,
    testemunhos: 0,
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
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#23232b] flex items-center justify-center text-4xl font-bold text-gray-100 shadow-lg mb-2 border border-[#18181b]">
            {user.email?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <div className="text-xl font-bold text-gray-100 mb-1">{user.user_metadata?.name || 'Usuário'}</div>
          <div className="text-base text-gray-400 mb-2">{user.email}</div>
        </div>
        <div className="bg-[#27272a] rounded-lg p-4 mb-6 text-left text-gray-100 shadow-inner w-full max-w-md border border-[#23232b]">
          <div className="mb-2"><span className="font-semibold">ID:</span> <span className="break-all">{user.id}</span></div>
          <div className="mb-2"><span className="font-semibold">Data de cadastro:</span> {formatDate(user.created_at)}</div>
        </div>
        {/* Cards de atividade */}
        <div className="w-full max-w-md mb-8">
          <h3 className="text-lg font-bold text-gray-100 mb-4">A Minha Atividade</h3>
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
              <span className="text-base font-medium mt-1">Pedidos</span>
            </div>
            <div className="bg-[#27272a] rounded-xl flex flex-col items-center justify-center py-6 shadow text-gray-100 border border-[#23232b]">
              <span className="text-3xl font-extrabold">{stats.testemunhos}</span>
              <span className="text-base font-medium mt-1">Testemunhos</span>
            </div>
          </div>
        </div>
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