import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';

interface PWASplashScreenProps {
  onComplete: () => void;
}

export function PWASplashScreen({ onComplete }: PWASplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Carregando Ore+...');

  useEffect(() => {
    const messages = [
      'Carregando Ore+...',
      'Preparando suas orações...',
      'Conectando com a comunidade...',
      'Quase pronto...',
    ];

    let currentMessage = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        
        if (newProgress % 25 === 0 && currentMessage < messages.length - 1) {
          currentMessage++;
          setMessage(messages[currentMessage]);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] flex items-center justify-center">
      <div className="text-center text-white">
        {/* Logo */}
        <div className="mb-8">
          <div className="bg-white/20 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Ore+</h1>
          <p className="text-white/80 text-sm">Orações Compartilhadas</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-4">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-white/90 text-sm mb-4">{message}</p>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-white/70" />
        </div>

        {/* Progress Percentage */}
        <p className="text-white/60 text-xs mt-4">{progress}%</p>
      </div>
    </div>
  );
} 