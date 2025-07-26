import { useState, useEffect } from 'react';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  deferredPrompt: any;
  showInstallPrompt: boolean;
  debugInfo: string[];
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    deferredPrompt: null,
    showInstallPrompt: false,
    debugInfo: [],
  });

  const addDebugInfo = (info: string) => {
    setPwaState(prev => ({
      ...prev,
      debugInfo: [...prev.debugInfo, `${new Date().toLocaleTimeString()}: ${info}`]
    }));
    console.log(`[PWA Debug] ${info}`);
  };

  useEffect(() => {
    addDebugInfo('Iniciando detecção PWA...');

    // Detectar plataforma
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const android = /Android/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);

    addDebugInfo(`Plataforma detectada: iOS=${iOS}, Android=${android}, Standalone=${standalone}, Chrome=${isChrome}, Edge=${isEdge}`);

    // Verificar se já foi instalado
    const wasInstalled = localStorage.getItem('pwa-installed') === 'true';
    addDebugInfo(`Já instalado: ${wasInstalled}`);

    setPwaState(prev => ({
      ...prev,
      isIOS: iOS,
      isAndroid: android,
      isStandalone: standalone,
      isInstalled: wasInstalled || standalone,
    }));

    // Listener para o evento de instalação
    const handleBeforeInstallPrompt = (e: any) => {
      addDebugInfo('Evento beforeinstallprompt capturado!');
      e.preventDefault();
      setPwaState(prev => ({
        ...prev,
        deferredPrompt: e,
        isInstallable: true,
        showInstallPrompt: true,
      }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      addDebugInfo('App instalado com sucesso!');
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        showInstallPrompt: false,
      }));
      localStorage.setItem('pwa-installed', 'true');
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se o evento beforeinstallprompt já foi disparado
    if ('beforeinstallprompt' in window) {
      addDebugInfo('beforeinstallprompt está disponível no window');
    } else {
      addDebugInfo('beforeinstallprompt NÃO está disponível no window');
    }

    // Mostrar prompt de instalação para iOS/Android após delay
    if (!standalone && !wasInstalled && (iOS || android)) {
      addDebugInfo('Configurando timer para mostrar prompt de instalação');
      const timer = setTimeout(() => {
        addDebugInfo('Mostrando prompt de instalação manual');
        setPwaState(prev => ({
          ...prev,
          showInstallPrompt: true,
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Para desktop, mostrar prompt se for Chrome/Edge
    if (!standalone && !wasInstalled && (isChrome || isEdge) && !iOS && !android) {
      addDebugInfo('Configurando timer para desktop Chrome/Edge');
      const timer = setTimeout(() => {
        addDebugInfo('Mostrando prompt de instalação para desktop');
        setPwaState(prev => ({
          ...prev,
          showInstallPrompt: true,
        }));
      }, 5000);

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    addDebugInfo('Tentando instalar app...');
    
    if (pwaState.deferredPrompt) {
      try {
        addDebugInfo('Usando deferredPrompt para instalação');
        pwaState.deferredPrompt.prompt();
        const { outcome } = await pwaState.deferredPrompt.userChoice;
        
        addDebugInfo(`Resultado da instalação: ${outcome}`);
        
        if (outcome === 'accepted') {
          setPwaState(prev => ({
            ...prev,
            isInstalled: true,
            showInstallPrompt: false,
          }));
          localStorage.setItem('pwa-installed', 'true');
          return true;
        }
      } catch (error) {
        addDebugInfo(`Erro na instalação: ${error}`);
        console.error('Erro na instalação:', error);
      }
    } else {
      addDebugInfo('Nenhum deferredPrompt disponível');
    }
    return false;
  };

  const dismissInstallPrompt = () => {
    addDebugInfo('Prompt de instalação descartado');
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: false,
    }));
  };

  const forceShowPrompt = () => {
    addDebugInfo('Forçando exibição do prompt de instalação');
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: true,
    }));
  };

  return {
    ...pwaState,
    installApp,
    dismissInstallPrompt,
    forceShowPrompt,
  };
} 