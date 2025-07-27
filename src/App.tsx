import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PWASplashScreen } from "./components/PWASplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detectar se está rodando como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(standalone);

    // Mostrar splash screen apenas se for PWA ou na primeira visita
    const hasVisited = localStorage.getItem('has-visited');
    if (!standalone && hasVisited) {
      setShowSplash(false);
    } else {
      localStorage.setItem('has-visited', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <PWASplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* O roteamento é feito em main.tsx */}
        {/* O conteúdo principal pode ser o Index ou outro componente */}
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
