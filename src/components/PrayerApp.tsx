import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PrayerRequestForm } from './PrayerRequestForm';
import PrayerRequestsList from './PrayerRequestsList';
import { Heart, Plus, List, LogOut, User } from 'lucide-react';
import { InstallButton } from './InstallButton';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { InstallNotification } from './InstallNotification';
import { PWADebug } from './PWADebug';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  if (!user) return null;
  return (
    <div className="relative" ref={userMenuRef}>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={() => setUserMenuOpen((v) => !v)}
        aria-label="Abrir menu do usuário"
      >
        <User className="h-5 w-5" />
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 py-2 animate-fade-in border border-gray-100">
          <div className="px-4 py-2 text-gray-700 text-sm border-b border-gray-100 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" />
            <span className="truncate">{user.email}</span>
          </div>
          <button
            onClick={async () => { await signOut(); setUserMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export function PrayerApp({ activeTab }: { activeTab?: 'list' | 'create' }) {
  // Todos os hooks no topo, SEM ifs ou returns antes
  const { user, signOut } = useAuth();
  const { refreshRequests } = usePrayerRequests();
  const [tab, setTab] = useState<'list' | 'create'>(activeTab ?? 'list');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sincroniza tab externo
  useEffect(() => {
    if (activeTab && activeTab !== tab) setTab(activeTab);
  }, [activeTab]);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Remover toda a lógica de gamificação

  const handleSignOut = async () => {
    await signOut();
  };

  // Renderização SEM returns condicionais antes dos hooks
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Botão de instalação no topo direito */}
      <div className="absolute top-6 right-6 z-50">
        <InstallButton />
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-auto px-2 sm:px-4 flex flex-col min-h-screen">
        {/* Conteúdo do PrayerApp */}
        {/* Header minimalista */}
        <header className="flex flex-col items-center justify-center mb-4 sm:mb-8 gap-2 animate-fade-in w-full relative">
          {/* Botão/avatar de usuário no canto superior direito */}
        </header>
        <div className="animate-fade-slide-in">
          <PrayerRequestsList refreshRequests={refreshRequests} />
        </div>
        {tab === 'create' && (
          <>
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <PrayerRequestForm refreshRequests={refreshRequests} onSent={() => setTab('list')} onCancel={() => setTab('list')} />
            </div>
          </>
        )}
      </div>

      {/* Botão flutuante para criar pedido */}
      {tab === 'list' && (
        <button
          className="fixed right-6 z-50 w-16 h-16 rounded-full bg-[#7c3aed] text-white text-4xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[#a084e8]/40"
          aria-label="Criar Pedido"
          onClick={() => setTab('create')}
          style={{ position: 'fixed', bottom: 32, right: 24 }}
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Notificação de instalação */}
      <InstallNotification />

      {/* Debug PWA (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && <PWADebug />}
    </div>
  );
}