import { useState } from 'react';
import { BookOpen, List } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab }: { activeTab: 'pedidos' | 'biblia', setActiveTab: (tab: 'pedidos' | 'biblia') => void }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur border-t border-gray-200 flex justify-around z-50">
      <button
        className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'pedidos' ? 'text-indigo-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('pedidos')}
      >
        <List className="h-6 w-6 mb-1" />
        <span className="text-xs font-semibold">Pedidos</span>
      </button>
      <button
        className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'biblia' ? 'text-indigo-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('biblia')}
      >
        <BookOpen className="h-6 w-6 mb-1" />
        <span className="text-xs font-semibold">Bíblia</span>
      </button>
    </nav>
  );
} 