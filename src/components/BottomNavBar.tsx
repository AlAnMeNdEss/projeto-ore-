import { Home, Users, BookOpen, Heart, User, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  console.log('BottomNavBar renderizando:', { activeTab, user: !!user });
  
  // Estado local para capítulo e livro
  const [capitulo, setCapitulo] = useState(1);
  const [livro, setLivro] = useState('Êxodo');
  const capitulos = Array.from({ length: 40 }, (_, i) => i + 1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

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
          
          <div className="profile-menu-container relative">
            <button
              className={`mobile-nav-item py-2 px-3 rounded-2xl transition-all duration-300 touch-ripple ${
                showProfileMenu 
                  ? 'bg-blue-50 text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
              }`}
              onClick={() => {
                console.log('Botão perfil clicado, showProfileMenu:', !showProfileMenu);
                setShowProfileMenu(!showProfileMenu);
              }}
            >
              <User className={`h-6 w-6 mb-1 transition-all duration-300 ${showProfileMenu ? 'scale-110' : ''}`} />
              <span className="text-xs font-semibold">Perfil</span>
            </button>
          </div>
        </div>
        
        {/* Menu de Perfil Dropdown */}
        {showProfileMenu && (
          <div 
            className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden max-h-[80vh] overflow-y-auto z-[10000]" 
            style={{ 
              transform: 'translateY(-10px)',
              position: 'absolute',
              bottom: '100%',
              left: '0',
              right: '0',
              marginBottom: '8px',
              marginLeft: '16px',
              marginRight: '16px'
            }}
          >
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center mb-3">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-white/30">
                  <span className="text-3xl font-bold text-white">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">
                    {user?.user_metadata?.name || 'Usuário'}
                  </h3>
                  <p className="text-blue-100 text-sm mb-2">{user?.email}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-100 text-xs font-medium">
                      Membro há {user ? Math.ceil((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} dias
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estatísticas principais */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Minha Atividade
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">-</div>
                  <div className="text-xs text-blue-700 font-medium">Orações Recebidas</div>
                  <div className="text-xs text-blue-500 mt-1">🙏</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">-</div>
                  <div className="text-xs text-green-700 font-medium">Pedidos Criados</div>
                  <div className="text-xs text-green-500 mt-1">📝</div>
                </div>
              </div>
              
              {/* Estatísticas adicionais */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-700">-</div>
                  <div className="text-xs text-gray-600">Feitas</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-700">-</div>
                  <div className="text-xs text-gray-600">Hoje</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-700">-</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
            
            {/* Informações detalhadas */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Informações da Conta
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-purple-700">Data de Cadastro</span>
                  </div>
                  <span className="text-sm font-medium text-purple-800">
                    {user ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-blue-700">Dias Ativo</span>
                  </div>
                  <span className="text-sm font-medium text-blue-800">
                    {user ? Math.ceil((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-green-700">Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Ativo
                  </span>
                </div>
              </div>
            </div>
            
            {/* Ações rápidas melhoradas */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Ações Rápidas
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex items-center gap-3 p-3 text-left text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 touch-ripple border border-blue-200 hover:border-blue-300 hover:shadow-md"
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Aqui você pode adicionar navegação para configurações
                  }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Configurações</div>
                    <div className="text-xs text-blue-500">Personalizar conta</div>
                  </div>
                </button>
                
                <button
                  className="flex items-center gap-3 p-3 text-left text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 touch-ripple border border-green-200 hover:border-green-300 hover:shadow-md"
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Aqui você pode adicionar navegação para ajuda
                  }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Ajuda</div>
                    <div className="text-xs text-green-500">Suporte e tutoriais</div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Botão de logout melhorado */}
            <div className="p-4">
              <button
                className="w-full flex items-center gap-3 p-4 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 touch-ripple border border-red-200 hover:border-red-300 hover:shadow-md"
                onClick={() => {
                  setShowProfileMenu(false);
                  signOut?.();
                }}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Sair da Conta</div>
                  <div className="text-xs text-red-500">Encerrar sessão</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}