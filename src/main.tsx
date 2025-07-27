import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ProfilePage from './pages/ProfilePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/perfil" element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
);

// Registrar o service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('Service Worker registrado:', registration);
      })
      .catch(error => {
        console.error('Erro ao registrar o Service Worker:', error);
      });
  });
}
