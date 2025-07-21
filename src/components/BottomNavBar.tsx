import React, { useEffect, useState } from "react";
import { BookOpen, List, User } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab }: { activeTab: 'pedidos' | 'biblia' | 'perfil', setActiveTab: (tab: 'pedidos' | 'biblia' | 'perfil') => void }) {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setHidden(true); // rolando para baixo, esconde
      } else {
        setHidden(false); // rolando para cima, mostra
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-xl transition-transform duration-300
        ${hidden ? "translate-y-full" : "translate-y-0"}`}
    >
      <div className="relative flex justify-around items-center bg-white/80 rounded-3xl shadow-2xl py-1 px-2 min-h-[52px] border border-[#e0e7ff] backdrop-blur-md">
        {/* Removido destaque animado */}
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
      </div>
    </nav>
  );
} 