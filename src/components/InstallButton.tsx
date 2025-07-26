import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Monitor, X, CheckCircle, ArrowUp, Heart } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallButton() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isStandalone,
    showInstallPrompt,
    installApp,
    dismissInstallPrompt,
  } = usePWA();

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await installApp();
        if (success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (error) {
        console.error('Erro na instalação:', error);
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowInstructions(true);
    }
  };

  const getInstallText = () => {
    if (isInstalling) return "Instalando...";
    if (isIOS) return "Instalar no iPhone";
    if (isAndroid) return "Instalar App";
    return "Instalar App";
  };

  const getInstallIcon = () => {
    if (isInstalling) return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />;
    if (isIOS || isAndroid) return <Smartphone className="h-4 w-4 mr-2" />;
    return <Monitor className="h-4 w-4 mr-2" />;
  };

  if (isStandalone || isInstalled) {
    return null;
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Instalar no iPhone</h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>Toque no botão <strong>"Compartilhar"</strong> (📤) no Safari</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>Role para baixo e toque em <strong>"Adicionar à Tela Inicial"</strong></p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>Toque em <strong>"Adicionar"</strong></p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              O Ore+ aparecerá na sua tela inicial como um app! 🎉
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">App Instalado!</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Botão flutuante no canto superior direito */}
      {showInstallPrompt && (
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-200 flex items-center animate-pulse"
          >
            {getInstallIcon()}
            {getInstallText()}
          </Button>
        </div>
      )}

      {/* Banner de instalação na parte inferior */}
      {showInstallPrompt && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white p-4 shadow-lg animate-slide-up install-banner">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Instalar Ore+</h3>
                <p className="text-xs opacity-90">Tenha acesso rápido às orações</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstallClick}
                disabled={isInstalling}
                size="sm"
                className="bg-white text-purple-600 hover:bg-gray-100 font-medium"
              >
                {isInstalling ? "Instalando..." : "Instalar"}
              </Button>
              <button
                onClick={dismissInstallPrompt}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 