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
import Biblia from '@/components/Biblia';
import { useSwipeable } from 'react-swipeable';
import HomePage from '@/pages/HomePage';

const tabs = ['inicio', 'comunidades', 'biblia', 'perfil'] as const;

type Tab = typeof tabs[number];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { requests } = usePrayerRequests();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [pedidosTab, setPedidosTab] = useState<'list' | 'create'>('list');

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

  // Swipe handlers para alternar abas
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
      // HomePage já tem o fundo lavanda, mas a BottomNavBar deve aparecer
      return <>
        <HomePage user={user} />
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab as (tab: 'inicio' | 'comunidades' | 'biblia' | 'perfil') => void} />
      </>;
    }
    return (
      <div
        {...handlers}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{
          background: '#f6eaff',
        }}
      >
        {/* Overlay para escurecer o fundo e dar contraste */}
        <div className="absolute inset-0 bg-[#2d1457]/70 z-0" />
        <div className="relative z-20 w-full">
          {activeTab === 'comunidades' && (
            <>
              {/* Logo e nome acima dos botões de pedidos */}
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] mb-2">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 20C16 17 16 14 16 12M16 20C16 18 14 16 13 15M16 20C16 18 18 16 19 15M13 15C12.5 14.5 12 13.5 12 13C12 12 13 11 14 12C15 13 15 14 15 15M19 15C19.5 14.5 20 13.5 20 13C20 12 19 11 18 12C17 13 17 14 17 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-[#b2a4ff] tracking-wide text-center">Ore+</h1>
              </div>
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
          {activeTab === 'biblia' && (
            <Biblia />
          )}
          {activeTab === 'perfil' && user && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white gap-8 w-full">
              {/* Topo: Avatar, nome, email */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-2">
                  {user.email?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
                </div>
                <div className="text-base text-[#8b5cf6] font-medium">{user.email}</div>
                <button
                  onClick={signOut}
                  className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white font-semibold shadow-md hover:brightness-110 transition-all duration-200"
                >
                  Sair
                </button>
              </div>
              {/* Estatísticas em cards */}
              <div className="flex flex-row flex-wrap gap-4 justify-center w-full max-w-2xl">
                <div className="flex flex-col items-center bg-white/10 rounded-xl p-4 min-w-[120px] shadow-md">
                  <BarChart2 className="w-7 h-7 text-[#8b5cf6] mb-1" />
                  <div className="text-xl font-bold">{pedidosDoUsuario.length}</div>
                  <div className="text-xs text-[#8b5cf6] font-semibold uppercase tracking-wide">Pedidos criados</div>
                </div>
                <div className="flex flex-col items-center bg-white/10 rounded-xl p-4 min-w-[120px] shadow-md">
                  <Send className="w-7 h-7 text-[#6d28d9] mb-1" />
                  <div className="text-xl font-bold">{totalOracoesRecebidas}</div>
                  <div className="text-xs text-[#6d28d9] font-semibold uppercase tracking-wide">Orações recebidas</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab as (tab: 'inicio' | 'comunidades' | 'biblia' | 'perfil') => void} />
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
