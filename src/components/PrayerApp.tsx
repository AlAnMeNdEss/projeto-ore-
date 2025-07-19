import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PrayerRequestForm } from './PrayerRequestForm';
import { PrayerRequestsList } from './PrayerRequestsList';
import { Heart, Plus, List, LogOut, User } from 'lucide-react';
import { InstallButton } from './InstallButton';

export function PrayerApp() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');


  // Remover toda a lógica de gamificação

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* Imagem de fundo de adoração */}
      <img src="/worship-bg.jpg" alt="Fundo de adoração" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 blur-sm" />
      {/* Fundo glassmorphism */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2d1457] via-[#8b5cf6]/60 to-[#181824] backdrop-blur-2xl bg-opacity-70" />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 flex flex-col min-h-screen">
        {/* Conteúdo do PrayerApp */}
        {/* Header minimalista */}
        <header className="flex flex-col items-center justify-center mb-4 sm:mb-8 gap-2 animate-fade-in">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] mb-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C16 17 16 14 16 12M16 20C16 18 14 16 13 15M16 20C16 18 18 16 19 15M13 15C12.5 14.5 12 13.5 12 13C12 12 13 11 14 12C15 13 15 14 15 15M19 15C19.5 14.5 20 13.5 20 13C20 12 19 11 18 12C17 13 17 14 17 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[#b2a4ff] tracking-wide text-center">Ore+</h1>
          <p className="text-xs text-gray-300 text-center">Comunidade de oração e fé</p>
          <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap justify-center">
            <InstallButton />
            {user && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            <Button variant="ghost" onClick={handleSignOut} className="text-[#b2a4ff] hover:text-white transition-colors duration-200">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>
        {/* Navegação - botão rolável animado */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="flex w-full max-w-md gap-2 overflow-x-auto scrollbar-hide rounded-xl bg-white/5 p-1 shadow-inner">
            <button
              className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${activeTab === 'list' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
              onClick={() => setActiveTab('list')}
            >
              <List className="h-4 w-4 mr-2 inline-block align-text-bottom" />
              Ver Pedidos
            </button>
            <button
              className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${activeTab === 'create' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
              onClick={() => setActiveTab('create')}
            >
              <Plus className="h-4 w-4 mr-2 inline-block align-text-bottom" />
              Criar Pedido
            </button>
          </div>
        </div>
        {/* Conteúdo principal em cards glassmorphism animados */}
        <main className="flex-1">
          <div className="w-full mx-auto px-1 sm:px-4 py-2 flex flex-col items-center">
            {/* Substituir o bloco de gamificação e manter apenas o conteúdo principal */}
            <div className="w-full max-w-4xl mx-auto">
              {activeTab === 'list' ? (
                <div className="animate-fade-slide-in">
                  <Card className="rounded-3xl shadow-2xl border-0 bg-[#2d1457]/80 shadow-xl mb-4 sm:mb-8 p-0 backdrop-blur-md overflow-hidden">
                    {/* Detalhe decorativo no topo */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] opacity-40 rounded-t-3xl" />
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 border-b border-white/10 px-4 sm:px-6 pt-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow-md">
                        🙏
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-[#8b5cf6] text-base mr-2">
                          Pedidos de Oração
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-4 px-4 sm:px-6">
                      <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-100">Pedidos de Oração</h2>
                      <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                        Clique em "Orar" para registrar sua oração e apoio
                      </p>
                      <PrayerRequestsList />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="animate-fade-slide-in">
                  <Card className="rounded-3xl shadow-2xl border-0 bg-[#2d1457]/80 shadow-xl mb-4 sm:mb-8 p-0 backdrop-blur-md overflow-hidden">
                    {/* Detalhe decorativo no topo */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] opacity-40 rounded-t-3xl" />
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 border-b border-white/10 px-4 sm:px-6 pt-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow-md">
                        ✍️
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-[#8b5cf6] text-base mr-2">
                          Novo Pedido
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-4 px-4 sm:px-6">
                      <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-100">Novo Pedido</h2>
                      <p className="text-gray-300">
                        Compartilhe seu pedido com nossa comunidade
                      </p>
                      <div className="w-full max-w-2xl mx-auto">
                        <PrayerRequestForm />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Footer minimalista */}
        <footer className="mt-auto py-4 sm:py-6 text-center text-xs animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#8b5cf6] drop-shadow">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-[#8b5cf6] animate-pulse" />
            <span className="font-semibold text-xs sm:text-sm">Feito com amor e fé</span>
          </div>
          <p className="text-xs sm:text-sm text-white drop-shadow-sm font-medium">"Orai uns pelos outros, para que sareis." - Tiago 5:16</p>
        </footer>
      </div>
    </div>
  );
}