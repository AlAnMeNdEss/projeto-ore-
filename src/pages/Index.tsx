import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/AuthPage';
import { PrayerApp } from '@/components/PrayerApp';
import WelcomePage from './WelcomePage';
import { Loader2, Heart } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Debug: verificar estados
  console.log('Index - user:', user, 'loading:', loading, 'showAuth:', showAuth);

  if (loading) {
    return (
      <div className="min-h-screen bg-spiritual bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-gradient-spiritual backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-12 w-12 text-prayer-primary mx-auto mb-4 animate-pulse" />
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário está logado, mostra o app
  if (user) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Imagem de fundo de adoração */}
        <img src="/worship-bg.jpg" alt="Fundo de adoração" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 blur-sm" />
        {/* Fundo glassmorphism */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2d1457] via-[#8b5cf6]/60 to-[#181824] backdrop-blur-2xl bg-opacity-70" />
        <div className="relative z-20 w-full">
          <PrayerApp />
        </div>
      </div>
    );
  }

  // Se não está logado e não mostrou auth ainda, mostra a página de boas-vindas
  if (!showAuth) {
    return <WelcomePage onStart={() => setShowAuth(true)} />;
  }

  // Se não está logado mas clicou em 'Começar', mostra o login
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo de adoração */}
      <img src="/worship-bg.jpg" alt="Fundo de adoração" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 blur-sm" />
      {/* Fundo glassmorphism */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2d1457] via-[#8b5cf6]/60 to-[#181824] backdrop-blur-2xl bg-opacity-70" />
      <div className="relative z-20 w-full max-w-md mx-auto p-6">
        <AuthPage />
      </div>
    </div>
  );
};

export default Index;
