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
