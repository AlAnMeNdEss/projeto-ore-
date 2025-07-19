import { Button } from '@/components/ui/button';
import { InstallButton } from '@/components/InstallButton';

interface WelcomePageProps {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl mx-auto py-20 text-center flex flex-col items-center">
        {/* Logo minimalista */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#8b5cf6] mb-6">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 24V12M16 12L12 16M16 12L20 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* Título grande */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d1457] mb-4 leading-tight">
          Ore+<br/>
          <span className="text-[#8b5cf6]">Sua comunidade de oração online</span>
        </h1>
        {/* Subtítulo persuasivo */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
          Compartilhe pedidos, apoie outras pessoas e fortaleça sua fé em um ambiente seguro, acolhedor e sem julgamentos.
        </p>
        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <span className="text-2xl">🙏</span>
            <span className="text-gray-700 text-base">Pedidos anônimos ou identificados</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <span className="text-2xl">🤝</span>
            <span className="text-gray-700 text-base">Apoie e ore por outros</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <span className="text-2xl">🔒</span>
            <span className="text-gray-700 text-base">Ambiente seguro e respeitoso</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <span className="text-2xl">📱</span>
            <span className="text-gray-700 text-base">Instale o app no seu celular</span>
          </div>
        </div>
        {/* Chamada para ação */}
        <Button
          className="w-full max-w-xs bg-[#8b5cf6] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-[#6d28d9] transition-all duration-200 mb-4"
          onClick={onStart}
        >
          Começar agora
        </Button>
        
        {/* Botão de instalação */}
        <div className="w-full max-w-xs">
          <InstallButton />
        </div>
      </div>
    </div>
  );
} 