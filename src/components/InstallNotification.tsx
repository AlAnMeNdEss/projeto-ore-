import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Gift, Star, Heart } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallNotification() {
  const [showNotification, setShowNotification] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isStandalone,
    installApp,
  } = usePWA();

  const handleInstall = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await installApp();
      } catch (error) {
        console.error('Erro na instalação:', error);
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      // Mostrar instruções para iOS
      const message = `
📱 Como instalar o Ore+ no iPhone:

1️⃣ Toque no botão "Compartilhar" (📤) no Safari
2️⃣ Role para baixo e toque em "Adicionar à Tela Inicial"
3️⃣ Toque em "Adicionar"

Agora o Ore+ aparecerá na sua tela inicial como um app! 🎉
      `;
      alert(message);
    }
  };

  const getInstallText = () => {
    if (isInstalling) return "Instalando...";
    if (isIOS) return "Instalar no iPhone";
    if (isAndroid) return "Instalar App";
    return "Instalar App";
  };

  const getBenefits = () => {
    return [
      { icon: <Heart className="h-4 w-4" />, text: "Acesso offline às orações" },
      { icon: <Gift className="h-4 w-4" />, text: "Notificações de novas orações" },
      { icon: <Star className="h-4 w-4" />, text: "Experiência como app nativo" },
    ];
  };

  if (isStandalone || isInstalled || !showNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white p-4 relative">
          <button
            onClick={() => setShowNotification(false)}
            className="absolute top-3 right-3 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Instalar Ore+</h3>
              <p className="text-sm opacity-90">Tenha uma experiência completa</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3 mb-4">
            {getBenefits().map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="text-purple-500">
                  {benefit.icon}
                </div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-semibold"
            >
              {isInstalling ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Smartphone className="h-4 w-4 mr-2" />
              )}
              {getInstallText()}
            </Button>
            
            <Button
              onClick={() => setShowNotification(false)}
              variant="outline"
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 