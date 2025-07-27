import { Home, Users, BookOpen, List } from 'lucide-react';
import { useState } from 'react';

export function BottomNavBar({ activeTab, setActiveTab, glass, renderCapituloBar }: { activeTab: 'inicio' | 'comunidades' | 'perfil' | 'biblia', setActiveTab: (tab: 'inicio' | 'comunidades' | 'perfil' | 'biblia') => void, glass?: boolean, renderCapituloBar?: boolean }) {
  // Estado local para capítulo e livro (exemplo, ajuste conforme integração real)
  const [capitulo, setCapitulo] = useState(1);
  const [livro, setLivro] = useState('Êxodo');
  const capitulos = Array.from({ length: 40 }, (_, i) => i + 1); // Exemplo para Êxodo

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        width: '100vw',
        left: 0,
        right: 0
      }}
    >
      <div className={`flex flex-col items-center min-h-[64px] py-2 px-2 w-full ${glass ? 'bg-[#23232b]/90 backdrop-blur-md border-t border-[#18181b] shadow-xl' : 'bg-[#23232b] shadow-2xl border-t border-[#18181b]'}`}>
        {renderCapituloBar && activeTab === 'biblia' && (
          <div className="flex items-center bg-white/80 rounded-full px-4 py-1 gap-2 shadow-lg border border-[#ececec] mb-2" style={{ minWidth: 220, height: 48 }}>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#23232b] text-xl mr-2 disabled:opacity-40 border border-[#ececec]"
              onClick={() => setCapitulo(c => Math.max(1, c - 1))}
              disabled={capitulo === 1}
              aria-label="Capítulo anterior"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="flex-1 text-center text-[#23232b] text-lg font-bold select-none" style={{ minWidth: 90 }}>{livro} {capitulo}</span>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#23232b] text-xl ml-2 disabled:opacity-40 border border-[#ececec]"
              onClick={() => setCapitulo(c => Math.min(capitulos.length, c + 1))}
              disabled={capitulo === capitulos.length}
              aria-label="Próximo capítulo"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        )}
        <div className="flex flex-row justify-around items-center w-full">
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
      </div>
    </nav>
  );
}