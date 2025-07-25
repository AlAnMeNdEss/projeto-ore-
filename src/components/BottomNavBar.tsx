import { Home, Users, BookOpen, List } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab, glass }: { activeTab: 'inicio' | 'comunidades' | 'perfil' | 'biblia', setActiveTab: (tab: 'inicio' | 'comunidades' | 'perfil' | 'biblia') => void, glass?: boolean }) {
  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-screen px-0"
      style={{paddingBottom: 'env(safe-area-inset-bottom, 0)'}}
    >
      <div className={`flex justify-around items-center rounded-t-3xl min-h-[64px] py-2 px-2 w-full ${glass ? 'bg-[#23232b]/90 backdrop-blur-md border border-[#18181b] shadow-xl' : 'bg-[#23232b] shadow-2xl border border-[#18181b]'}`}>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'inicio' ? 'text-gray-100 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('inicio')}
        >
          <Home className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Início</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'comunidades' ? 'text-gray-100 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('comunidades')}
        >
          <List className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Comunidades</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all duration-200 z-10 ${activeTab === 'biblia' ? 'text-gray-100 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('biblia')}
        >
          <BookOpen className="h-7 w-7 mb-1" />
          <span className="text-sm font-semibold">Bíblia</span>
        </button>
      </div>
    </nav>
  );
}