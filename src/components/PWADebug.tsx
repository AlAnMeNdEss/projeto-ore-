import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Download, Smartphone, Monitor, X, CheckCircle } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWADebug() {
  const [showDebug, setShowDebug] = useState(false);
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isStandalone,
    showInstallPrompt,
    debugInfo,
    forceShowPrompt,
    installApp,
  } = usePWA();

  const getPlatformIcon = () => {
    if (isIOS) return <Smartphone className="h-4 w-4" />;
    if (isAndroid) return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (isInstalled) return 'bg-green-500';
    if (isInstallable) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug PWA
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Debug PWA
            </CardTitle>
            <Button
              onClick={() => setShowDebug(false)}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {/* Status Geral */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                <span className="text-sm">
                  {isInstalled ? 'Instalado' : isInstallable ? 'Instalável' : 'Não instalável'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Plataforma</h3>
              <div className="flex items-center gap-2">
                {getPlatformIcon()}
                <span className="text-sm">
                  {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}
                </span>
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Badge variant={isStandalone ? "default" : "secondary"}>
              Standalone: {isStandalone ? 'Sim' : 'Não'}
            </Badge>
            <Badge variant={showInstallPrompt ? "default" : "secondary"}>
              Show Prompt: {showInstallPrompt ? 'Sim' : 'Não'}
            </Badge>
            <Badge variant={isInstallable ? "default" : "secondary"}>
              Installable: {isInstallable ? 'Sim' : 'Não'}
            </Badge>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              Installed: {isInstalled ? 'Sim' : 'Não'}
            </Badge>
          </div>

          {/* Ações */}
          <div className="space-y-2 mb-6">
            <h3 className="font-semibold text-sm">Ações</h3>
            <div className="flex gap-2">
              <Button
                onClick={forceShowPrompt}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Forçar Prompt
              </Button>
              
              <Button
                onClick={installApp}
                size="sm"
                disabled={!isInstallable}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Instalar
              </Button>
            </div>
          </div>

          {/* Logs de Debug */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Logs de Debug</h3>
            <div className="bg-gray-100 rounded-lg p-3 max-h-40 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum log disponível</p>
              ) : (
                debugInfo.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-gray-700 mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Informações do Navegador */}
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-sm">Informações do Navegador</h3>
            <div className="text-xs space-y-1">
              <div>User Agent: {navigator.userAgent.substring(0, 100)}...</div>
              <div>Service Worker: {'serviceWorker' in navigator ? 'Suportado' : 'Não suportado'}</div>
              <div>HTTPS: {window.location.protocol === 'https:' ? 'Sim' : 'Não'}</div>
              <div>URL: {window.location.href}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 