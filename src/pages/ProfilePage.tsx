import { useAuth } from '@/hooks/useAuth';
import { LogOut, ArrowLeft, RefreshCw, TrendingUp, Sparkles, CalendarDays, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [oracoesFeitas, setOracoesFeitas] = useState<number>(0);
  const [oracoesHoje, setOracoesHoje] = useState<number>(0);
  const [pedidos, setPedidos] = useState<number>(0);
  const [oracoesRecebidas, setOracoesRecebidas] = useState<number>(0);
  const [mediaOracoesPorPedido, setMediaOracoesPorPedido] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const diasAtivo = useMemo(() => {
    if (!user?.created_at) return 0;
    const ms = new Date().getTime() - new Date(user.created_at).getTime();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [user?.created_at]);

  const fetchStats = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const hoje = new Date().toISOString().slice(0, 10);

      const { count: feitasCount } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (typeof feitasCount === 'number') setOracoesFeitas(feitasCount);

      const { count: hojeCount } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', `${hoje}T00:00:00.000Z`)
        .lte('created_at', `${hoje}T23:59:59.999Z`);
      if (typeof hojeCount === 'number') setOracoesHoje(hojeCount);

      const { data: pedidosData } = await supabase
        .from('prayer_requests')
        .select('id, prayer_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (Array.isArray(pedidosData)) {
        const totalPedidos = pedidosData.length;
        setPedidos(totalPedidos);

        const totalRecebidasFallback = pedidosData.reduce((acc, p) => acc + (p.prayer_count || 0), 0);
        setOracoesRecebidas(totalRecebidasFallback);

        if (totalPedidos > 0) {
          const pedidoIds = pedidosData.map(p => p.id);
          const { data: interacoesData } = await supabase
            .from('prayer_interactions')
            .select('id, prayer_request_id')
            .in('prayer_request_id', pedidoIds);
          if (Array.isArray(interacoesData)) {
            setOracoesRecebidas(interacoesData.length);
            setMediaOracoesPorPedido(
              totalPedidos > 0 ? Math.round(interacoesData.length / totalPedidos) : 0
            );
          } else {
            setMediaOracoesPorPedido(
              totalPedidos > 0 ? Math.round(totalRecebidasFallback / totalPedidos) : 0
            );
          }
        } else {
          setMediaOracoesPorPedido(0);
        }
      } else {
        setPedidos(0);
        setOracoesRecebidas(0);
        setMediaOracoesPorPedido(0);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erro ao buscar estatísticas do perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const id = setInterval(fetchStats, 30000);
    return () => clearInterval(id);
  }, [user?.id]);

  const formatHora = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#87CEEB]">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-white/40 px-4 py-3 flex items-center gap-2 shadow-sm">
        <button
          className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
          onClick={() => navigate('/')}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-800">Meu Perfil</h1>
        <button
          className={`p-2 rounded-xl transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'}`}
          onClick={() => !loading && fetchStats()}
          aria-label="Atualizar"
          disabled={loading}
          title="Atualizar estatísticas"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-6 text-white shadow-inner">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-white/30">
            <span className="text-3xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{user?.user_metadata?.name || 'Usuário'}</div>
            <div className="text-sm text-blue-100">{user?.email}</div>
            <div className="mt-1 text-xs text-blue-100">
              Membro há {diasAtivo} dias
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-100/90">
          Última atualização: <span className="font-semibold">{formatHora(lastUpdated)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Estatísticas principais */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-2">Minha Atividade</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-sky-100" />
              <div className="p-4 text-center relative">
                <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center ring-1 ring-white/60">
                  <Sparkles className="w-5 h-5 text-sky-700" />
                </div>
                <div className="text-2xl font-extrabold text-sky-700">{loading ? '...' : oracoesRecebidas}</div>
                <div className="text-xs text-sky-800 font-medium">Orações Recebidas</div>
                <div className="text-[10px] text-sky-600/80 mt-1">Somatório em seus pedidos</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-100" />
              <div className="p-4 text-center relative">
                <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center ring-1 ring-white/60">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">{loading ? '...' : pedidos}</div>
                <div className="text-xs text-emerald-800 font-medium">Pedidos Criados</div>
                <div className="text-[10px] text-emerald-700/80 mt-1">Total publicados por você</div>
              </div>
            </div>
          </div>
          {(!loading && pedidos === 0) && (
            <div className="mt-2 text-xs text-gray-700 bg-white/70 rounded-xl p-3 border border-white/60 backdrop-blur-xl">
              Você ainda não criou pedidos.
            </div>
          )}
        </div>

        {/* Estatísticas adicionais */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-2">Detalhes</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-3 text-center border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
              <div className="mx-auto mb-1 w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center ring-1 ring-white/60">
                <Award className="w-4 h-4 text-violet-700" />
              </div>
              <div className="text-lg font-extrabold text-gray-800">{loading ? '...' : oracoesFeitas}</div>
              <div className="text-[11px] text-gray-600">Feitas</div>
            </div>
            <div className="rounded-2xl p-3 text-center border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
              <div className="mx-auto mb-1 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center ring-1 ring-white/60">
                <CalendarDays className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-lg font-extrabold text-gray-800">{loading ? '...' : oracoesHoje}</div>
              <div className="text-[11px] text-gray-600">Hoje</div>
            </div>
            <div className="rounded-2xl p-3 text-center border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
              <div className="mx-auto mb-1 w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center ring-1 ring-white/60">
                <TrendingUp className="w-4 h-4 text-sky-700" />
              </div>
              <div className="text-lg font-extrabold text-gray-800">{loading ? '...' : mediaOracoesPorPedido}</div>
              <div className="text-[11px] text-gray-600">Média/Pedido</div>
            </div>
          </div>
        </div>

        {/* Informações da conta */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-2">Minha Conta</h2>
          <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-sm divide-y divide-white/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm">Data de Cadastro</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{user ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Award className="w-4 h-4" />
                <span className="text-sm">Dias Ativo</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{diasAtivo}</div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Status</span>
              </div>
              <div className="text-sm font-semibold text-emerald-700">Ativo</div>
            </div>
          </div>
        </div>

        {/* Sair */}
        <div className="pt-1">
          <button
            className="w-full flex items-center justify-center gap-3 p-4 text-left text-red-700 bg-white/80 rounded-2xl transition-all duration-200 touch-ripple border border-white/60 backdrop-blur-xl shadow-sm hover:shadow-md active:scale-[0.99]"
            onClick={() => signOut?.()}
          >
            <LogOut className="w-4 h-4 text-red-700" />
            <div className="font-semibold text-sm">Sair da Conta</div>
          </button>
        </div>
      </div>
    </div>
  );
}
