import { useAuth } from '@/hooks/useAuth';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { PrayerApp } from '@/components/PrayerApp';
import { Loader2, Heart } from 'lucide-react';
import { useState } from 'react';
import bgImage from '@/assets/spiritual-background.jpg';
import { useSwipeable } from 'react-swipeable';

const tabs = ['list', 'create'] as const;
type Tab = typeof tabs[number];

export default function ComunidadesPage() {
  const { user, loading } = useAuth();
  const { requests } = usePrayerRequests();
  const [pedidosTab, setPedidosTab] = useState<Tab>('list');

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

  return (
    <div
      {...handlers}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#2d1457]/70 z-0" />
      <div className="relative z-20 w-full">
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] mb-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C16 17 16 14 16 12M16 20C16 18 14 16 13 15M16 20C16 18 18 16 19 15M13 15C12.5 14.5 12 13.5 12 13C12 12 13 11 14 12C15 13 15 14 15 15M19 15C19.5 14.5 20 13.5 20 13C20 12 19 11 18 12C17 13 17 14 17 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[#b2a4ff] tracking-wide text-center">Ore+</h1>
        </div>
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
        <PrayerApp activeTab={pedidosTab} />
      </div>
    </div>
  );
} 