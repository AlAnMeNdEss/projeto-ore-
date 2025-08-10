import { Home, BookOpen, Heart, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function BottomNavBar({ 
  activeTab, 
  setActiveTab, 
  glass, 
  renderCapituloBar, 
  user, 
  signOut 
}: { 
  activeTab: 'inicio' | 'comunidades' | 'biblia', 
  setActiveTab: (tab: 'inicio' | 'comunidades' | 'biblia') => void, 
  glass?: boolean, 
  renderCapituloBar?: boolean,
  user?: any,
  signOut?: () => void
}) {
  const navigate = useNavigate();
  
  // Estado local para capítulo e livro
  const [capitulo, setCapitulo] = useState(1);
  const [livro, setLivro] = useState('Êxodo');
  const capitulos = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <nav
      className="fixed bottom-0 left-0 z-[9999] w-full safe-area-bottom"
      style={{
        width: '100vw',
        left: 0,
        right: 0
      }}
    >
      <div 
        className={`flex flex-col items-center min-h-[80px] py-3 px-4 w-full ${
          glass 
            ? 'bg-white/90 backdrop-blur-xl border-t border-white/40 shadow-2xl' 
            : 'bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {renderCapituloBar && activeTab === 'biblia' && (
          <div 
            className="flex items-center bg-white/90 rounded-2xl px-4 py-2 gap-3 shadow-lg border border-gray-200/50 mb-3 touch-ripple" 
            style={{ minWidth: 240, height: 52 }}
          >
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 text-white text-lg disabled:opacity-40 disabled:bg-gray-300 transition-all duration-200 active:scale-95"
              onClick={() => setCapitulo(c => Math.max(1, c - 1))}
              disabled={capitulo === 1}
              aria-label="Capítulo anterior"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="flex-1 text-center text-gray-800 text-lg font-bold select-none" style={{ minWidth: 100 }}>
              {livro} {capitulo}
            </span>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 text-white text-lg disabled:opacity-40 disabled:bg-gray-300 transition-all duration-200 active:scale-95"
              onClick={() => setCapitulo(c => Math.min(capitulos.length, c + 1))}
              disabled={capitulo === capitulos.length}
              aria-label="Próximo capítulo"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex flex-row justify-around items-center w-full gap-2">
          <button
            className={`mobile-nav-item flex-1 py-2 px-3 rounded-2xl transition-all duration-300 touch-ripple ${
              activeTab === 'inicio' 
                ? 'bg-blue-50 text-blue-600 shadow-md' 
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('inicio')}
          >
            <Home className={`h-6 w-6 mb-1 transition-all duration-300 ${activeTab === 'inicio' ? 'scale-110' : ''}`} />
            <span className="text-xs font-semibold">Início</span>
          </button>
          
          <button
            className={`mobile-nav-item flex-1 py-2 px-3 rounded-2xl transition-all duration-300 touch-ripple ${
              activeTab === 'comunidades' 
                ? 'bg-blue-50 text-blue-600 shadow-md' 
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('comunidades')}
          >
            <Heart className={`h-6 w-6 mb-1 transition-all duration-300 ${activeTab === 'comunidades' ? 'scale-110' : ''}`} />
            <span className="text-xs font-semibold">Comunidades</span>
          </button>
          
          <button
            className={`mobile-nav-item flex-1 py-2 px-3 rounded-2xl transition-all duration-300 touch-ripple ${
              activeTab === 'biblia' 
                ? 'bg-blue-50 text-blue-600 shadow-md' 
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('biblia')}
          >
            <BookOpen className={`h-6 w-6 mb-1 transition-all duration-300 ${activeTab === 'biblia' ? 'scale-110' : ''}`} />
            <span className="text-xs font-semibold">Bíblia</span>
          </button>
          
          <button
            className={`mobile-nav-item py-2 px-3 rounded-2xl transition-all duration-300 touch-ripple text-gray-600 hover:text-blue-500 hover:bg-gray-50`}
            onClick={() => navigate('/perfil')}
          >
            <User className={`h-6 w-6 mb-1 transition-all duration-300`} />
            <span className="text-xs font-semibold">Perfil</span>
          </button>
        </div>
      </div>
    </nav>
  );
}