import { Home, Users, BookOpen, List } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab }: { activeTab: 'inicio' | 'comunidades' | 'biblia', setActiveTab: (tab: 'inicio' | 'comunidades' | 'biblia') => void }) {
  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-screen px-0"
      style={{paddingBottom: 'env(safe-area-inset-bottom, 0)'}}
    >
      <div className="flex justify-around items-center bg-white rounded-t-3xl shadow-2xl py-2 px-2 min-h-[64px] border border-[#ede7f6] backdrop-blur-md w-full">
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'inicio' ? 'text-[#7c3aed] font-bold' : 'text-[#7c3aed]/60 hover:text-[#7c3aed]'}`}
          onClick={() => setActiveTab('inicio')}
        >
          <Home className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Início</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'comunidades' ? 'text-[#7c3aed] font-bold' : 'text-[#7c3aed]/60 hover:text-[#7c3aed]'}`}
          onClick={() => setActiveTab('comunidades')}
        >
          <List className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Comunidades</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'biblia' ? 'text-[#7c3aed] font-bold' : 'text-[#7c3aed]/60 hover:text-[#7c3aed]'}`}
          onClick={() => setActiveTab('biblia')}
        >
          <BookOpen className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Bíblia</span>
        </button>
      </div>
    </nav>
  );
} 