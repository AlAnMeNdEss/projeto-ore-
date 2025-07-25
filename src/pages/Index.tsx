import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/AuthPage';
import { PrayerApp, UserMenu } from '@/components/PrayerApp';
import WelcomePage from './WelcomePage';
import { Loader2, Heart, User as UserIcon, Send, Users, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BottomNavBar } from '@/components/BottomNavBar';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { PRAYER_CATEGORIES } from '@/types/prayer';
import { useSwipeable } from 'react-swipeable';
import HomePage from '@/pages/HomePage';
import { PrayerRequestForm } from '@/components/PrayerRequestForm';
import { Biblia } from '@/components/Biblia';
import { useRef } from 'react';

const tabs = ['inicio', 'comunidades', 'biblia', 'perfil'] as const;

type Tab = typeof tabs[number];

// Estado global para a barra de navegação da Bíblia
const Index = () => {
  const [showBottomNavBar, setShowBottomNavBar] = useState(true);
  const handleShowNavBar = (show: boolean) => setShowBottomNavBar(show);
  // Mover todos os hooks para o topo, antes de qualquer return condicional
  const { user, loading, signOut } = useAuth();
  const { requests } = usePrayerRequests();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [pedidosTab, setPedidosTab] = useState<'list' | 'create'>('list');
  const [showCreateModalInicio, setShowCreateModalInicio] = useState(false);
  const [entrouNaComunidade, setEntrouNaComunidade] = useState(false);
  // Sempre que mudar para a aba 'comunidades', reseta para false

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
        <div className="relative">
          <HomePage user={user} onFazerPedido={() => setShowCreateModalInicio(true)} onVerComunidade={() => { setActiveTab('comunidades'); setEntrouNaComunidade(true); }} />
          {showCreateModalInicio && (
            <>
              <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <PrayerRequestForm onSent={() => setShowCreateModalInicio(false)} onCancel={() => setShowCreateModalInicio(false)} />
              </div>
            </>
          )}
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </>;
    }
    if (activeTab === 'comunidades') {
      return (
        <div className={`min-h-screen w-full flex flex-col items-center px-0 ${entrouNaComunidade ? 'relative' : ''}`}
          style={entrouNaComunidade ? { background: "#23232b url('https://todoendios.com/wp-content/uploads/2021/09/web3-cross-easter-sunrise-dark-shutterstock_381056461-shutterstock.jpg') center center / cover no-repeat", backgroundAttachment: 'fixed' } : { background: '#18181b' }}>
          {!entrouNaComunidade && (
            <div className="absolute inset-0 bg-[#23232b]/60 z-0 pointer-events-none" />
          )}
          {!entrouNaComunidade ? (
            <>
              <div className="w-full max-w-xl mx-auto pt-8 pb-4 relative z-10">
                <h1 className="text-4xl font-extrabold text-gray-100 mb-2 text-center">Comunidades</h1>
                <p className="text-lg text-gray-400 mb-6 text-center">Participe num grupo de oração</p>
                <div className="w-full flex items-center justify-center">
                  <button
                    className="max-w-md w-full flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#27272a] text-gray-100 text-2xl font-bold px-8 py-6 rounded-2xl shadow-lg border border-[#23232b] hover:bg-[#23232b] transition-all duration-200 mb-6 cursor-pointer"
                    style={{ minHeight: 90 }}
                    onClick={() => setEntrouNaComunidade(true)}
                    tabIndex={0}
                    aria-label="Entrar na Comunidade Global"
                  >
                    <span className="flex items-center justify-center mb-2 sm:mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mr-0 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.5.5 7.5 1.5M12 3C9.245 3 6.5 3.5 4.5 4.5M12 3v18m0 0c2.755 0 5.5-.5 7.5-1.5M12 21c-2.755 0-5.5-.5-7.5-1.5M21 12c0 2.755-.5 5.5-1.5 7.5M21 12c0-2.755-.5-5.5-1.5-7.5M21 12H3m0 0c0 2.755.5 5.5 1.5 7.5M3 12c0-2.755.5-5.5 1.5-7.5" /></svg>
                    </span>
                    <span className="text-center w-full">Comunidade Global</span>
                  </button>
                </div>
              </div>
              <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          ) : (
            <>
              <div className="w-full flex flex-col items-center" style={entrouNaComunidade ? { position: 'relative', zIndex: 1 } : {}}>
                <div className="w-full max-w-xl mx-auto pt-8 pb-4 flex items-center">
                  <button onClick={() => setEntrouNaComunidade(false)} className="mr-2 p-2 rounded-full hover:bg-[#ede9fe] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#23232b]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <h1 className="text-3xl font-extrabold text-white mb-4 text-center flex-1" style={{ textShadow: '0 2px 8px #23232b99' }}>Comunidade Global</h1>
                  <div style={{width: 40}} />
                </div>
                <div className="w-full max-w-xl mx-auto border-b border-[#e0c3fc] mb-4"></div>
                {/* Botões Ver Pedidos e Criar Pedido removidos */}
                <PrayerApp activeTab={pedidosTab} />
              </div>
            </>
          )}
        </div>
      );
    }
    if (activeTab === 'biblia') {
      return (
        <div className="min-h-screen w-full bg-[#f6eaff]">
          <Biblia />
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      );
    }
    // ...perfil ou outros...
    return (
      <div
        {...handlers}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ background: '#18181b' }}
      >
        <div className="relative z-20 w-full">
          {/* Página de perfil antiga removida. */}
        </div>
        <div className="w-full flex flex-col gap-4 items-center">
          {/* Card Devocional Diário */}
          <div className="w-full max-w-sm mx-auto rounded-2xl bg-[#23232b] shadow-lg p-3 px-3 sm:px-4 mb-4 border border-[#27272a] box-border">
            {/* Conteúdo do devocional diário aqui */}
          </div>
          {/* Card Resumo da Comunidade */}
          <div className="w-full max-w-sm mx-auto rounded-2xl bg-[#23232b] shadow-lg p-3 px-3 sm:px-4 mb-4 border border-[#27272a] box-border">
            {/* Conteúdo do resumo da comunidade aqui */}
          </div>
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} glass />
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
