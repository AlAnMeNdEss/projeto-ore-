import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Imagem de fundo de adoração */}
      <img src="/worship-bg.jpg" alt="Fundo de adoração" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 blur-sm" />
      {/* Fundo glassmorphism */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2d1457] via-[#8b5cf6]/60 to-[#181824] backdrop-blur-2xl bg-opacity-70" />
      <div className="relative z-20 w-full flex flex-col items-center justify-center min-h-screen">
        {/* Conteúdo da página NotFound */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-8">Página não encontrada.</p>
          <a href="/" className="text-[#a78bfa] underline">Voltar para o início</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
