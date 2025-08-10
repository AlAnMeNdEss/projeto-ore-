import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Star } from 'lucide-react';

interface InstallNotificationProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallNotification({ onInstall, onDismiss }: InstallNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Mostrar a notificação após um pequeno delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await onInstall();
    } catch (error) {
      console.error('Erro na instalação:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-20 left-4 right-4 z-50 safe-area-bottom"
        >
          <div className="mobile-card p-4 shadow-mobile-xl border border-gray-200/50">
            <div className="flex items-start gap-3">
              {/* Ícone */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="mobile-text-medium text-gray-800">Instalar App</h3>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <p className="mobile-text-caption text-gray-600 mb-3">
                  Instale o Silent Prayers no seu dispositivo para uma experiência melhor
                </p>

                {/* Botões */}
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="mobile-button-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isInstalling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Instalando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Instalar
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="mobile-button-secondary px-4"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador de progresso sutil */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 