declare global {
  interface Window { OneSignal?: any }
}

export function getOneSignalAppId(): string | undefined {
  const id = (import.meta as any).env?.VITE_ONESIGNAL_APP_ID as string | undefined;
  return id && id.trim().length > 0 ? id : undefined;
}

export function hasOneSignal(): boolean {
  return !!getOneSignalAppId();
}

export function initOneSignal() {
  const appId = getOneSignalAppId();
  if (!appId) return;

  if (window.OneSignal) return; // já carregado

  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
  script.async = true;
  script.onload = () => {
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function () {
      window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
        serviceWorkerParam: { scope: '/' },
        serviceWorkerPath: 'OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: 'OneSignalSDKUpdaterWorker.js',
        autoResubscribe: true,
        promptOptions: { slidedown: { autoPrompt: false } },
      });

      // Prompt automático não intrusivo: só se não estiver inscrito e a permissão ainda for 'default'
      window.OneSignal.isPushNotificationsEnabled((enabled: boolean) => {
        if (!enabled) {
          if ('Notification' in window && Notification.permission === 'default') {
            try { window.OneSignal.showSlidedownPrompt(); } catch {}
          }
        }
      });
    });
  };
  document.head.appendChild(script);
}

export function promptPushSubscribe() {
  if (!window.OneSignal) return;
  window.OneSignal.push(function () {
    try {
      window.OneSignal.showSlidedownPrompt();
    } catch {}
  });
}

export function setOneSignalTags(tags: Record<string, string | number | boolean>) {
  if (!window.OneSignal) return;
  window.OneSignal.push(function () {
    try {
      window.OneSignal.sendTags(tags);
    } catch {}
  });
}
