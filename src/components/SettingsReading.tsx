import { useEffect, useState } from 'react';
import { getReadingNotifyConfig, setReadingNotifyConfig, startDailyReadingNotifications, stopDailyReadingNotifications } from '@/notifications/dailyReading';
import { hasOneSignal, setOneSignalTags, promptPushSubscribe } from '@/notifications/onesignal';

export default function SettingsReading() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('08:00');

  useEffect(() => {
    const cfg = getReadingNotifyConfig();
    setEnabled(cfg.enabled);
    setTime(cfg.time);
  }, []);

  function save() {
    setReadingNotifyConfig({ enabled, time });
    if (enabled) startDailyReadingNotifications();
    else stopDailyReadingNotifications();

    // Tags para campanhas/segmentação no OneSignal (se presente)
    try {
      if (hasOneSignal()) {
        const planStart = localStorage.getItem('biblePlanStart') || new Date().toISOString().slice(0,10);
        setOneSignalTags({ reading_enabled: enabled ? 1 : 0, reading_time: time, plan_start: planStart });
        if (enabled) {
          // Tentar prompt se ainda não inscrito
          promptPushSubscribe();
        }
      }
    } catch {}

    alert('Preferências salvas.');
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Notificações de Leitura</h1>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
        <span>Ativar notificações diárias</span>
      </label>
      <label className="flex items-center gap-2">
        <span>Horário:</span>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border rounded px-2 py-1" />
      </label>
      <button onClick={save} className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
      <p className="text-xs text-gray-500">As notificações usam o Service Worker (PWA). Você pode precisar permitir notificações no navegador.</p>
    </div>
  );
}
