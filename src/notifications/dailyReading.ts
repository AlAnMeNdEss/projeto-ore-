export type ReadingNotifyConfig = {
  enabled: boolean;
  time: string; // 'HH:MM' 24h
};

const CONFIG_KEY = 'readingNotifyConfig';
const LAST_SENT_KEY = 'readingNotifyLastDate';

export function getReadingNotifyConfig(): ReadingNotifyConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, time: '08:00' };
}

export function setReadingNotifyConfig(cfg: ReadingNotifyConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

async function showLocalNotification(title: string, options?: NotificationOptions) {
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg?.showNotification) {
        await reg.showNotification(title, options);
        return;
      }
    }
  } catch {}
  // Fallback: janela ativa
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
}

function shouldSendNow(time: string): boolean {
  const [hh, mm] = time.split(':').map(Number);
  const now = new Date();
  return now.getHours() === hh && now.getMinutes() === mm;
}

let intervalId: number | undefined;

export async function startDailyReadingNotifications() {
  const ok = await requestPermission();
  if (!ok) return;

  if (intervalId) window.clearInterval(intervalId);

  intervalId = window.setInterval(async () => {
    const cfg = getReadingNotifyConfig();
    if (!cfg.enabled) return;

    const last = localStorage.getItem(LAST_SENT_KEY);
    const today = todayISO();
    if (last === today) return;

    if (shouldSendNow(cfg.time)) {
      await showLocalNotification('Leitura Bíblica de hoje', {
        body: 'Sua leitura do plano de 1 ano está pronta. Toque para abrir.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: { url: '/?tab=biblia' },
      });
      localStorage.setItem(LAST_SENT_KEY, today);
    }
  }, 30_000); // checa a cada 30s para economizar bateria
}

export function stopDailyReadingNotifications() {
  if (intervalId) window.clearInterval(intervalId);
  intervalId = undefined;
}
