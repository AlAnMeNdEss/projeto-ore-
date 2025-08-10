import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import ProfilePage from '@/pages/ProfilePage';
import SettingsReading from '@/components/SettingsReading';
import MobileSwipeBack from '@/components/MobileSwipeBack';

export default function App() {
  return (
    <BrowserRouter>
      <MobileSwipeBack />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/settings-reading" element={<SettingsReading />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
