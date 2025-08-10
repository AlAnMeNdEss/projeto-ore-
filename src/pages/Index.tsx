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
import { Biblia } from '@/components/Biblia';
import { useRef } from 'react';
import loginBackground from '../assets/login-background.jpg';
import { useLocation } from 'react-router-dom';
import backgroundClouds from '../assets/src/assets/background-clouds.jpg';
import { TestimonyForm } from '@/components/TestimonyForm';
import { useTestimonies } from '@/hooks/useTestimonies';
import { GroupForm } from '@/components/GroupForm';
import { useGroups } from '@/hooks/useGroups';

const tabs = ['inicio', 'comunidades', 'biblia'] as const;

type Tab = typeof tabs[number];

// Estado global para a barra de navegação da Bíblia
const Index = () => {
  const [showBottomNavBar, setShowBottomNavBar] = useState(true);
  const handleShowNavBar = (show: boolean) => setShowBottomNavBar(show);
  // Mover todos os hooks para o topo, antes de qualquer return condicional
  const { user, loading, signOut } = useAuth();
  const { requests } = usePrayerRequests();
  const { testimonies, loading: loadingTestimonies, deleteTestimony } = useTestimonies();
  const { myGroups, loading: loadingGroups, createGroup } = useGroups();
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  
  // Função para obter a aba inicial baseada no localStorage ou URL
  const getInitialTab = (): Tab => {
    try {
      const savedTab = localStorage.getItem('activeTab') as Tab;
      if (savedTab && tabs.includes(savedTab)) {
        return savedTab;
      }
    } catch (error) {
      console.error('Erro ao ler aba salva:', error);
    }
    return 'inicio';
  };
  
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);
  const [pedidosTab, setPedidosTab] = useState<'list' | 'create'>('list');
  const [entrouNaComunidade, setEntrouNaComunidade] = useState(false);
  const [entrouNoMural, setEntrouNoMural] = useState(false);
  const [entrouNosGrupos, setEntrouNosGrupos] = useState(false);
  const [showTestimonyForm, setShowTestimonyForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  
  // Garantir que o estado seja resetado ao entrar na aba comunidades
  useEffect(() => {
    if (activeTab === 'comunidades') {
      console.log('Entrou na aba comunidades - resetando estados');
      setEntrouNaComunidade(false);
      setEntrouNoMural(false);
      setEntrouNosGrupos(false);
    }
  }, [activeTab]);
  // Sempre que mudar para a aba 'comunidades', reseta para false

  // Salvar aba ativa no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('activeTab', activeTab);
    } catch (error) {
      console.error('Erro ao salvar aba ativa:', error);
    }
  }, [activeTab]);

  // Resetar estado da comunidade quando mudar de aba
  useEffect(() => {
    if (activeTab !== 'comunidades') {
      console.log('Resetando estados - mudou para aba:', activeTab);
      setEntrouNaComunidade(false);
      setEntrouNoMural(false);
      setEntrouNosGrupos(false);
    }
  }, [activeTab]);

  // Restaurar estado quando a página é carregada
  useEffect(() => {
    const savedTab = getInitialTab();
    if (savedTab !== activeTab) {
      setActiveTab(savedTab);
    }
  }, [location.pathname]);

  // Restaurar estado quando o usuário estiver logado
  useEffect(() => {
    if (user && !loading) {
      const savedTab = getInitialTab();
      if (savedTab !== activeTab) {
        setActiveTab(savedTab);
      }
    }
  }, [user, loading]);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há poucos minutos';
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const handleDeleteTestimony = async (testimonyId: string) => {
    if (confirm('Tem certeza que deseja apagar este testemunho?')) {
      const result = await deleteTestimony(testimonyId);
      if (result.success) {
        // Toast de sucesso será mostrado automaticamente via Realtime
      } else {
        alert('Erro ao apagar testemunho. Tente novamente.');
      }
    }
  };

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

  // Verificar se o usuário está logado e restaurar estado se necessário
  useEffect(() => {
    if (user && !loading) {
      // Se o usuário está logado, garantir que não estamos na tela de boas-vindas
      if (showAuth === false) {
        setShowAuth(true);
      }
    }
  }, [user, loading, showAuth]);

  // Verificar se o usuário já estava logado anteriormente (para funcionar offline)
  useEffect(() => {
    try {
      const wasLoggedIn = localStorage.getItem('wasLoggedIn');
      if (wasLoggedIn === 'true' && !user && !loading) {
        // Se o usuário estava logado antes, não mostrar a tela de boas-vindas
        setShowAuth(true);
      }
    } catch (error) {
      console.error('Erro ao verificar estado de login:', error);
    }
  }, [user, loading]);

  // Salvar estado de login quando o usuário fizer login
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('wasLoggedIn', 'true');
      } catch (error) {
        console.error('Erro ao salvar estado de login:', error);
      }
    }
  }, [user]);

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

  // Se não está logado e não mostrou auth ainda, mostra a página de boas-vindas
  if (!showAuth && !user && !loading) {
    return <WelcomePage onStart={() => setShowAuth(true)} />;
  }

  // Se não está logado mas clicou em 'Começar', mostra o login
  if (!user && !loading) {
    return <AuthPage />;
  }

  // Se ainda está carregando, mostrar loading
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

  // Se chegou até aqui, deve mostrar o app principal
  // Se o usuário está logado, mostra o app
  if (user) {
    if (activeTab === 'inicio') {
      return <>
        <div className="relative">
          <HomePage
            user={user}
            onFazerPedido={() => { setActiveTab('comunidades'); setEntrouNaComunidade(true); }}
            onVerComunidade={() => { setActiveTab('comunidades'); setEntrouNaComunidade(true); }}
          />
          {/* Modal antigo removido */}
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} />
      </>;
    }
    if (activeTab === 'comunidades') {
      return (
        <div className={`min-h-screen w-full flex flex-col items-center px-0 ${entrouNaComunidade ? 'relative' : 'overflow-y-auto'}`}
          style={entrouNaComunidade ? { 
            background: "#23232b url('https://todoendios.com/wp-content/uploads/2021/09/web3-cross-easter-sunrise-dark-shutterstock_381056461-shutterstock.jpg') center center / cover no-repeat", 
            backgroundAttachment: 'fixed' 
          } : { 
            backgroundImage: `url(${backgroundClouds})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
          }}>
          {!entrouNaComunidade && (
            <div className="absolute inset-0 bg-white/20 z-0 pointer-events-none" />
          )}
          {entrouNaComunidade ? (
            <div style={{
              backgroundImage: `url(${backgroundClouds})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              minHeight: '100vh',
              width: '100vw',
              position: 'relative',
              zIndex: 1,
            }} className="w-full flex flex-col items-center">
              <div className="mobile-container w-full pt-8 pb-4 flex items-center">
                <button onClick={() => setEntrouNaComunidade(false)} className="mr-3 p-2 rounded-2xl hover:bg-white/20 transition-all duration-200 touch-ripple">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#23232b]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <h1 className="text-3xl font-extrabold text-white mb-4 text-center flex-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)' }}>Comunidade Global</h1>
                <div style={{width: 40}} />
              </div>
              <div className="w-full max-w-xl mx-auto border-b border-white/30 mb-4"></div>
              {/* Botões Ver Pedidos e Criar Pedido removidos */}
              <PrayerApp activeTab={pedidosTab} />
            </div>
          ) : entrouNosGrupos ? (
            <>
              <div className="w-full flex flex-col items-center" style={{ position: 'relative', zIndex: 1 }}>
                <div className="mobile-container w-full pt-8 pb-4 flex items-center">
                  <button onClick={() => setEntrouNosGrupos(false)} className="mr-3 p-2 rounded-2xl hover:bg-white/20 transition-all duration-200 touch-ripple">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#23232b]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <h1 className="text-3xl font-extrabold text-white mb-4 text-center flex-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)' }}>Meus Grupos</h1>
                  <div style={{width: 40}} />
                </div>
                <div className="w-full max-w-xl mx-auto border-b border-white/30 mb-4"></div>
                {/* Conteúdo dos Meus Grupos */}
                <div className="mobile-container w-full">
                  <div className="text-center text-white/80 mb-8">
                    <p className="text-lg">Gerencie seus grupos de oração</p>
                    <p className="text-sm mt-2">Crie e participe de grupos privados</p>
                  </div>
                  
                  {/* Lista de grupos */}
                  <div className="mobile-spacing mb-6">
                    {loadingGroups ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="text-white/60 mt-2">Carregando grupos...</p>
                      </div>
                    ) : myGroups.length === 0 ? (
                      <div className="mobile-card-glass p-6 border border-white/20">
                        <div className="text-center text-white/80">
                          <p className="text-lg font-semibold mb-2">Nenhum grupo ainda</p>
                          <p className="text-sm">Crie seu primeiro grupo de oração</p>
                        </div>
                      </div>
                    ) : (
                      myGroups.map((group) => (
                        <div key={group.id} className="mobile-card-glass p-4 border border-white/20">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-lg">{group.name}</h3>
                              {group.description && (
                                <p className="text-white/70 text-sm mt-1">{group.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`mobile-badge ${
                                  group.is_private 
                                    ? 'mobile-badge-error' 
                                    : 'mobile-badge-success'
                                }`}>
                                  {group.is_private ? 'Privado' : 'Público'}
                                </span>
                                <span className="text-white/50 text-xs">
                                  Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Botão para criar novo grupo */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowGroupForm(true)}
                      className="mobile-button-primary"
                    >
                      + Criar Novo Grupo
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Formulário de criação de grupos */}
              {showGroupForm && (
                <GroupForm
                  onSent={() => {
                    setShowGroupForm(false);
                    // Os grupos serão atualizados automaticamente via Realtime
                  }}
                  onCancel={() => setShowGroupForm(false)}
                />
              )}
            </>
          ) : entrouNoMural ? (
            <>
              <div className="w-full flex flex-col items-center" style={{ position: 'relative', zIndex: 1 }}>
                <div className="mobile-container w-full pt-8 pb-4 flex items-center">
                  <button onClick={() => setEntrouNoMural(false)} className="mr-3 p-2 rounded-2xl hover:bg-white/20 transition-all duration-200 touch-ripple">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#23232b]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <h1 className="text-3xl font-extrabold text-white mb-4 text-center flex-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)' }}>Mural de Testemunhos</h1>
                  <div style={{width: 40}} />
                </div>
                <div className="w-full max-w-xl mx-auto border-b border-white/30 mb-4"></div>
                {/* Conteúdo do Mural de Testemunhos */}
                <div className="mobile-container w-full">
                  <div className="text-center text-white/80 mb-8">
                    <p className="text-lg">Compartilhe e leia testemunhos de fé</p>
                    <p className="text-sm mt-2">Em breve você poderá compartilhar suas experiências aqui</p>
                  </div>
                  {/* Listagem de testemunhos reais */}
                  <div className="mobile-spacing">
                    {loadingTestimonies ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#673AB7]"></div>
                        <p className="text-gray-500 mt-2">Carregando testemunhos...</p>
                      </div>
                    ) : testimonies.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum testemunho compartilhado ainda.</p>
                        <p className="text-gray-400 text-sm mt-1">Seja o primeiro a compartilhar!</p>
                      </div>
                    ) : (
                      testimonies.map((testimony) => {
                        // Usar nome real do usuário se for o usuário logado, senão usar ID
                        const isCurrentUser = user && testimony.user_id === user.id;
                        const userName = isCurrentUser 
                          ? (user.user_metadata?.username || user.user_metadata?.name || user.email?.split('@')[0] || `Usuário ${testimony.user_id.slice(0, 8)}`)
                          : `Usuário ${testimony.user_id.slice(0, 8)}`;
                        const userInitial = userName.charAt(0).toUpperCase();
                        
                        const canDelete = user && testimony.user_id === user.id;
                        
                        return (
                          <div key={testimony.id} className="mobile-card p-4">
                            {/* Cabeçalho */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[2px]">
                                  <div className="w-full h-full rounded-[14px] bg-white/80 flex items-center justify-center">
                                    <span className="text-teal-700 font-extrabold">{userInitial}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="text-[#0f172a] font-bold text-base truncate">{testimony.title}</h3>
                                  {canDelete && (
                                    <button
                                      onClick={() => handleDeleteTestimony(testimony.id)}
                                      className="text-red-500 hover:text-red-600 p-2 rounded-xl transition-colors touch-ripple"
                                      title="Apagar testemunho"
                                      aria-label="Apagar testemunho"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                  <span className="truncate"><span className="font-medium text-slate-700">Partilhado por:</span> {userName}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="whitespace-nowrap">{formatDate(testimony.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="relative">
                              <div className="absolute -left-1 -top-1 text-slate-300">“</div>
                              <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-line">
                                {testimony.content}
                              </p>
                              <div className="absolute -right-1 -bottom-4 text-slate-300">”</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
              
              {/* Botão flutuante para adicionar testemunho */}
              <button
                className="mobile-button-floating"
                aria-label="Adicionar Testemunho"
                onClick={() => {
                  console.log('Botão adicionar testemunho clicado!');
                  setShowTestimonyForm(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              
              {/* Formulário de testemunhos */}
              {showTestimonyForm && (
                <TestimonyForm
                  onSent={() => {
                    setShowTestimonyForm(false);
                    // Os testemunhos serão atualizados automaticamente via Realtime
                  }}
                  onCancel={() => setShowTestimonyForm(false)}
                />
              )}
            </>
          ) : (
            <>
              <div className="mobile-container w-full pt-8 pb-4 relative z-10 overflow-y-auto min-h-screen">
                <h1 className="text-4xl font-extrabold text-white mb-2 text-center" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'}}>Comunidades</h1>
                <p className="text-lg text-white mb-6 text-center font-semibold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)'}}>Participe num grupo de oração</p>
                <div className="w-full flex flex-col items-center justify-center space-y-6">
                  {/* Botão Comunidade Global */}
                  <button
                    className="group relative w-full h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl overflow-hidden cursor-pointer touch-ripple hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
                    onClick={() => setEntrouNaComunidade(true)}
                    tabIndex={0}
                    aria-label="Entrar na Comunidade Global"
                  >
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Conteúdo do botão */}
                    <div className="relative z-10 h-full flex items-center justify-center px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.5.5 7.5 1.5M12 3C9.245 3 6.5 3.5 4.5 4.5M12 3v18m0 0c2.755 0 5.5-.5 7.5-1.5M12 21c-2.755 0-5.5-.5-7.5-1.5M21 12c0 2.755-.5 5.5-1.5 7.5M21 12c0-2.755-.5-5.5-1.5-7.5M21 12H3m0 0c0 2.755.5 5.5 1.5 7.5M3 12c0-2.755-.5-5.5-1.5-7.5" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white">Comunidade Global</h3>
                          <p className="text-white/80 text-sm">Conecte-se com fiéis do mundo todo</p>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Botão Mural de Testemunhos */}
                  <button
                    className="group relative w-full h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl overflow-hidden cursor-pointer touch-ripple hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
                    onClick={() => {
                      console.log('Botão Mural clicado!');
                      setEntrouNoMural(true);
                    }}
                    tabIndex={0}
                    aria-label="Acessar Mural de Testemunhos"
                  >
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Conteúdo do botão */}
                    <div className="relative z-10 h-full flex items-center justify-center px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white">Mural de Testemunhos</h3>
                          <p className="text-white/80 text-sm">Compartilhe e leia experiências de fé</p>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Botão Meus Grupos */}
                  <button
                    className="group relative w-full h-24 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-3xl overflow-hidden cursor-pointer touch-ripple hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
                    onClick={() => {
                      console.log('Botão Meus Grupos clicado!');
                      setEntrouNosGrupos(true);
                    }}
                    tabIndex={0}
                    aria-label="Acessar Meus Grupos"
                  >
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Conteúdo do botão */}
                    <div className="relative z-10 h-full flex items-center justify-center px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white">Meus Grupos</h3>
                          <p className="text-white/80 text-sm">Gerencie seus grupos de oração</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="pb-20"></div>
              <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} />
            </>
          )}
        </div>
      );
    }
    if (activeTab === 'biblia') {
      return (
        <div className="min-h-screen w-full bg-[#f6eaff]">
          <Biblia />
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} />
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
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} glass />
      </div>
    );
  }

  // Se chegou até aqui, deve mostrar o app principal
  return null;
};

export default Index;
