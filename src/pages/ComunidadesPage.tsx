import { useAuth } from '@/hooks/useAuth';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { PrayerApp } from '@/components/PrayerApp';
import { Loader2, Heart, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import bgImage from '@/assets/spiritual-background.jpg';
import { useSwipeable } from 'react-swipeable';
import { supabase } from '../integrations/supabase/client';

const tabs = ['list', 'create'] as const;
type Tab = typeof tabs[number];

function ResumoComunitario({ requests }: { requests: any[] }) {
  console.log('ResumoComunitario requests:', requests);
  const [totalOracoesFeitas, setTotalOracoesFeitas] = useState(0);
  
  // Cálculo dos totais
  const totalPedidos = requests.length;
  const totalOracoesRecebidas = requests.reduce((acc, r) => acc + (r.prayer_count || 0), 0);
  const totalUsuarios = new Set(requests.map(r => r.user_id)).size;

  // Buscar total de orações feitas pelos usuários
  useEffect(() => {
    async function fetchTotalOracoes() {
      const { count } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true });
      setTotalOracoesFeitas(count || 0);
    }
    fetchTotalOracoes();
  }, []);

  // Estados para animar suavemente os números
  const [displayPedidos, setDisplayPedidos] = useState(totalPedidos);
  const [displayOracoes, setDisplayOracoes] = useState(totalOracoesFeitas);
  const [displayUsuarios, setDisplayUsuarios] = useState(totalUsuarios);
  const pedidosRef = useRef(displayPedidos);
  const oracoesRef = useRef(displayOracoes);
  const usuariosRef = useRef(displayUsuarios);

  useEffect(() => {
    if (displayPedidos !== totalPedidos) {
      const diff = totalPedidos - displayPedidos;
      const step = diff > 0 ? 1 : -1;
      const interval = setInterval(() => {
        pedidosRef.current += step;
        setDisplayPedidos(pedidosRef.current);
        if (pedidosRef.current === totalPedidos) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    } else {
      pedidosRef.current = totalPedidos;
    }
  }, [totalPedidos]);

  useEffect(() => {
    if (displayOracoes !== totalOracoesFeitas) {
      const diff = totalOracoesFeitas - displayOracoes;
      const step = diff > 0 ? 1 : -1;
      const interval = setInterval(() => {
        oracoesRef.current += step;
        setDisplayOracoes(oracoesRef.current);
        if (oracoesRef.current === totalOracoesFeitas) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    } else {
      oracoesRef.current = totalOracoesFeitas;
    }
  }, [totalOracoesFeitas]);

  useEffect(() => {
    if (displayUsuarios !== totalUsuarios) {
      const diff = totalUsuarios - displayUsuarios;
      const step = diff > 0 ? 1 : -1;
      const interval = setInterval(() => {
        usuariosRef.current += step;
        setDisplayUsuarios(usuariosRef.current);
        if (usuariosRef.current === totalUsuarios) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    } else {
      usuariosRef.current = totalUsuarios;
    }
  }, [totalUsuarios]);

  return (
    <div className="w-full max-w-md mx-auto mb-4 animate-fade-in">
      <div className="flex flex-row justify-around items-center bg-white/80 rounded-2xl shadow p-4 border border-[#b2a4ff]/30">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#8b5cf6]">{displayPedidos}</span>
          <span className="text-xs text-[#2d1457] font-semibold">Pedidos</span>
        </div>
        <div className="w-px h-8 bg-[#b2a4ff]/30 mx-2" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#8b5cf6]">{displayOracoes}</span>
          <span className="text-xs text-[#2d1457] font-semibold">Orações Feitas</span>
        </div>
        <div className="w-px h-8 bg-[#b2a4ff]/30 mx-2" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#8b5cf6]">{displayUsuarios}</span>
          <span className="text-xs text-[#2d1457] font-semibold">Usuários</span>
        </div>
      </div>
    </div>
  );
}

export default function ComunidadesPage() {
  const { user, loading } = useAuth();
  const { requests } = usePrayerRequests();
  const [pedidosTab, setPedidosTab] = useState<Tab>('list');
  const [entrouNaComunidade, setEntrouNaComunidade] = useState(false);

  const pedidosDoUsuario = user ? requests.filter(r => r.user_id === user.id) : [];
  const totalOracoesRecebidas = pedidosDoUsuario.reduce((acc, r) => acc + (r.prayer_count || 0), 0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setPedidosTab('create'),
    onSwipedRight: () => setPedidosTab('list'),
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

  if (!entrouNaComunidade) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-2 bg-[#f6eaff] overflow-x-hidden"
      >
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <button
            className="w-full max-w-md flex items-center gap-4 bg-gradient-to-br from-[#a084e8] to-[#8b5cf6] text-white text-2xl font-bold px-8 py-6 rounded-3xl shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#a084e8]/40 mb-4"
            style={{ minHeight: 90 }}
            onClick={() => setEntrouNaComunidade(true)}
          >
            <Globe className="w-8 h-8 mr-2" />
            <span className="text-left">Comunidade<br/>Global</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...handlers}
      className="min-h-screen w-full flex flex-col items-center justify-center px-2 bg-[#f6eaff] overflow-x-hidden"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] mb-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C16 17 16 14 16 12M16 20C16 18 14 16 13 15M16 20C16 18 18 16 19 15M13 15C12.5 14.5 12 13.5 12 13C12 12 13 11 14 12C15 13 15 14 15 15M19 15C19.5 14.5 20 13.5 20 13C20 12 19 11 18 12C17 13 17 14 17 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[#b2a4ff] tracking-wide text-center">Ore+</h1>
        </div>
        {/* Card de resumo comunitário */}
        <ResumoComunitario requests={requests} />
        {/* Removido botão de criar pedidos ao lado de ver pedidos */}
        <PrayerApp activeTab={pedidosTab} />
      </div>
    </div>
  );
} 