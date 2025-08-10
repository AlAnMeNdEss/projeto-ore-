import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getReadingNotifyConfig, startDailyReadingNotifications } from '@/notifications/dailyReading'
import { initOneSignal } from '@/notifications/onesignal'
import './index.css'
import ProfilePage from './pages/ProfilePage.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(async (reg) => {
    try {
      // OneSignal Web SDK (push real)
      initOneSignal();
      // Inicializa notificações diárias se estiverem ativadas e após SW pronto
      const cfg = getReadingNotifyConfig();
      if (cfg.enabled) {
        await navigator.serviceWorker.ready;
        startDailyReadingNotifications();
      }
    } catch {}
  }).catch(() => {
    // fallback: inicializar sem SW (apenas se permitido)
    try {
      const cfg = getReadingNotifyConfig();
      if (cfg.enabled) startDailyReadingNotifications();
    } catch {}
  })
} else {
  // Sem suporte a SW
  try {
    const cfg = getReadingNotifyConfig();
    if (cfg.enabled) startDailyReadingNotifications();
  } catch {}
}
