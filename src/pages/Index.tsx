import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/AuthPage';
import { PrayerApp, UserMenu } from '@/components/PrayerApp';
import WelcomePage from './WelcomePage';
import { Loader2, Heart, User as UserIcon, Send, Users, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { BottomNavBar } from '@/components/BottomNavBar';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { PRAYER_CATEGORIES } from '@/types/prayer';
import { useSwipeable } from 'react-swipeable';
import HomePage from '@/pages/HomePage';

const tabs = ['inicio', 'comunidades', 'biblia', 'perfil'] as const;

type Tab = typeof tabs[number];

const Index = () => {
  // Mover todos os hooks para o topo, antes de qualquer return condicional
  const { user, loading, signOut } = useAuth();
  const { requests } = usePrayerRequests();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [pedidosTab, setPedidosTab] = useState<'list' | 'create'>('list');
  const [entrouNaComunidade, setEntrouNaComunidade] = useState(false);

  const pedidosDoUsuario = user ? requests.filter(r => r.user_id === user.id) : [];
  const totalOracoesRecebidas = pedidosDoUsuario.reduce((acc, r) => acc + (r.prayer_count || 0), 0);
  // Ordenar pedidos do usuário por data de criação (mais recente primeiro)
  const pedidosOrdenados = [...pedidosDoUsuario].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const ultimoPedido = pedidosOrdenados[0];
  const primeiroPedido = pedidosOrdenados.length > 0 ? pedidosOrdenados[pedidosOrdenados.length - 1] : undefined;
  // Estatísticas simples
  const mediaOracoes = pedidosDoUsuario.length > 0 ? (totalOracoesRecebidas / pedidosDoUsuario.length).toFixed(1) : '0';
  const pedidoMaisOrado = pedidosDoUsuario.reduce((max, r) => (r.prayer_count > (max?.prayer_count || 0) ? r : max), undefined as typeof pedidosDoUsuario[0] | undefined);

  // Gráfico de linha: evolução das orações nos últimos 7 dias
  const dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const oracoesPorDia = dias.map((dia) => {
    const diaStr = dia.toISOString().slice(0, 10);
    const total = pedidosDoUsuario.reduce((acc, p) => {
      const pedidoDia = new Date(p.created_at).toISOString().slice(0, 10);
      return pedidoDia === diaStr ? acc + (p.prayer_count || 0) : acc;
    }, 0);
    return {
      dia: dia.toLocaleDateString('pt-BR', { weekday: 'short' }),
      oracoes: total,
    };
  });

  // Gráfico de pizza: proporção de pedidos criados e orações recebidas por categoria
  const categorias = Object.keys(PRAYER_CATEGORIES);
  const dataPedidos = categorias.map(cat => ({
    name: PRAYER_CATEGORIES[cat],
    value: pedidosDoUsuario.filter(p => p.category === cat).length
  })).filter(d => d.value > 0);
  const dataOracoes = categorias.map(cat => ({
    name: PRAYER_CATEGORIES[cat],
    value: pedidosDoUsuario.filter(p => p.category === cat).reduce((acc, p) => acc + (p.prayer_count || 0), 0)
  })).filter(d => d.value > 0);
  const pieColors = ['#8b5cf6', '#f3e8ff', '#6d28d9', '#a78bfa', '#b2a4ff', '#e0c3fc'];

  // Gráfico de barras agrupadas: pedidos criados e orações recebidas por categoria
  const dataCategorias = categorias.map(cat => ({
    categoria: PRAYER_CATEGORIES[cat],
    pedidos: pedidosDoUsuario.filter(p => p.category === cat).length,
    oracoes: pedidosDoUsuario.filter(p => p.category === cat).reduce((acc, p) => acc + (p.prayer_count || 0), 0)
  })).filter(d => d.pedidos > 0 || d.oracoes > 0);

  // Emojis/carinhas para o topo das barras
  const barEmojis = ['😐', '😏', '😕', '😃', '😒', '😎'];

  // Debug: verificar estados
  console.log('Index - user:', user, 'loading:', loading, 'showAuth:', showAuth);

  // Remover swipe lateral global para evitar navegação acidental na página da Bíblia
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const idx = tabs.indexOf(activeTab);
      if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
    },
    onSwipedRight: () => {
      const idx = tabs.indexOf(activeTab);
      if (idx > 0) setActiveTab(tabs[idx - 1]);
    },
    trackMouse: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-spiritual bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-gradient-spiritual backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-12 w-12 text-prayer-primary mx-auto mb-4 animate-pulse" />
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário está logado, mostra o app
  if (user) {
    if (activeTab === 'inicio') {
      return <>
        <HomePage user={user} />
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </>;
    }
    if (activeTab === 'comunidades') {
      return (
        <div className="min-h-screen w-full flex flex-col items-center px-4 bg-[#f6eaff]">
          {!entrouNaComunidade ? (
            <div className="w-full max-w-xl mx-auto pt-8 pb-4">
              <h1 className="text-4xl font-extrabold text-[#23232b] mb-2 text-left">Comunidades</h1>
              <p className="text-lg text-[#6d6d7b] mb-6 text-left">Participe num grupo de oração</p>
              <button
                className="w-full flex items-center gap-4 bg-gradient-to-br from-[#a084e8] to-[#8b5cf6] text-white text-2xl font-bold px-8 py-6 rounded-3xl shadow-lg transition-all duration-200 mb-6"
                style={{ minHeight: 90 }}
                onClick={() => setEntrouNaComunidade(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.5.5 7.5 1.5M12 3C9.245 3 6.5 3.5 4.5 4.5M12 3v18m0 0c2.755 0 5.5-.5 7.5-1.5M12 21c-2.755 0-5.5-.5-7.5-1.5M21 12c0 2.755-.5 5.5-1.5 7.5M21 12c0-2.755-.5-5.5-1.5-7.5M21 12H3m0 0c0 2.755.5 5.5 1.5 7.5M3 12c0-2.755.5-5.5 1.5-7.5" /></svg>
                Comunidade Global
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4 sm:mb-8">
                <div className="flex w-full max-w-md gap-2 overflow-x-auto scrollbar-hide rounded-xl bg-white/5 p-1 shadow-inner">
                  <button
                    className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${pedidosTab === 'list' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
                    onClick={() => setPedidosTab('list')}
                  >
                    Ver Pedidos
                  </button>
                  <button
                    className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${pedidosTab === 'create' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
                    onClick={() => setPedidosTab('create')}
                  >
                    Criar Pedido
                  </button>
                </div>
              </div>
              <PrayerApp activeTab={pedidosTab} />
            </>
          )}
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      );
    }
    if (activeTab === 'biblia') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] w-full bg-[#f6eaff]">
          <h1 className="text-3xl font-extrabold text-[#7c3aed] mb-4">Bíblia</h1>
          <p className="text-lg text-[#2d1457] mb-6">Página da Bíblia em desenvolvimento.</p>
          <span className="text-5xl">📖🚧</span>
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      );
    }
    // ...perfil ou outros...
    return (
      <div
        {...handlers}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ background: '#f6eaff' }}
      >
        <div className="relative z-20 w-full">
          {/* Página de perfil antiga removida. */}
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  }

  // Se não está logado e não mostrou auth ainda, mostra a página de boas-vindas
  if (!showAuth) {
    return <WelcomePage onStart={() => setShowAuth(true)} />;
  }

  // Se não está logado mas clicou em 'Começar', mostra o login
  return <AuthPage />;
};

export default Index;
