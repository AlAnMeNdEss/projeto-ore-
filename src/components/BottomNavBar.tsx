import { BookOpen, List, User } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab }: { activeTab: 'pedidos' | 'biblia' | 'perfil', setActiveTab: (tab: 'pedidos' | 'biblia' | 'perfil') => void }) {
  // Map tab to index for animation
  const tabIndex = activeTab === 'pedidos' ? 0 : activeTab === 'biblia' ? 1 : 2;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-xl">
      <nav className="relative flex justify-around items-center bg-white rounded-3xl shadow-2xl py-1 px-2 min-h-[52px] border border-[#e0e7ff]">
        {/* Destaque animado para o botão ativo */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
          <div
            className="transition-transform duration-300 ease-in-out absolute -top-4 left-0 w-1/3 flex justify-center"
            style={{ transform: `translateX(${tabIndex * 100}%)` }}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-full shadow-lg border-4 border-white" />
          </div>
        </div>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'pedidos' ? 'text-[#8b5cf6] font-bold' : 'text-[#2d1457]/60 hover:text-[#8b5cf6]'}`}
          onClick={() => setActiveTab('pedidos')}
        >
          <List className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Pedidos</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'biblia' ? 'text-[#8b5cf6] font-bold' : 'text-[#2d1457]/60 hover:text-[#8b5cf6]'}`}
          onClick={() => setActiveTab('biblia')}
        >
          <BookOpen className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Bíblia</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'perfil' ? 'text-[#8b5cf6] font-bold' : 'text-[#2d1457]/60 hover:text-[#8b5cf6]'}`}
          onClick={() => setActiveTab('perfil')}
          aria-label="Perfil"
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Perfil</span>
        </button>
      </nav>
    </div>
  );
} 