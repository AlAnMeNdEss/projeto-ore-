import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Monitor } from 'lucide-react';

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Detectar se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se é Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Detectar se já está instalado como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listener para o evento de instalação (Android/Desktop)
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Mostrar botão se não estiver instalado e for iOS ou Android
    if (!standalone && (iOS || android)) {
      setShowInstallButton(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Desktop - usar prompt nativo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
    } else if (isIOS) {
      // iOS - mostrar instruções
      showIOSInstructions();
    }
  };

  const showIOSInstructions = () => {
    const message = `
📱 Como instalar o Ore+ no iPhone:

1️⃣ Toque no botão "Compartilhar" (📤) no Safari
2️⃣ Role para baixo e toque em "Adicionar à Tela Inicial"
3️⃣ Toque em "Adicionar"

Agora o Ore+ aparecerá na sua tela inicial como um app! 🎉
    `;
    alert(message);
  };

  const getInstallText = () => {
    if (isIOS) return "Instalar no iPhone";
    if (isAndroid) return "Instalar";
    return "Instalar App";
  };

  const getInstallIcon = () => {
    if (isIOS || isAndroid) return <Smartphone className="h-4 w-4 mr-2" />;
    return <Monitor className="h-4 w-4 mr-2" />;
  };

  if (!showInstallButton || isStandalone) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-200 flex items-center"
    >
      <Download className="h-4 w-4 mr-2" />
      {getInstallText()}
    </Button>
  );
} 