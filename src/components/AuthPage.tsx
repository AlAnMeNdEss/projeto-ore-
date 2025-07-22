import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const { signIn, user } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(loginForm.email, loginForm.password);
    setLoading(false);
  };

  // Google login
  const handleGoogle = async () => {
    setLoading(true);
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="min-h-screen flex flex-col justify-center items-center px-4 gradient-bg"
      style={{
        background: 'linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 100%)',
      }}
    >
      {/* Logo e slogan */}
      <div className="mb-8 flex flex-col items-center">
        <h1 className="font-logo text-5xl font-extrabold select-none mb-2">
          <span style={{ color: '#673AB7' }}>Ore</span>
          <span style={{ color: '#9575CD' }}>+</span>
        </h1>
        <p className="text-lg text-[#757575] text-center font-medium mb-6">A conectar corações em fé</p>
      </div>
      {/* Formulário */}
      <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9575CD] text-xl">
            <FaEnvelope />
          </span>
          <Input
            type="email"
            placeholder="E-mail"
            value={loginForm.email}
            onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            required
            className="pl-12 pr-4 py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
            style={{ boxShadow: '0 2px 16px #ede9fe' }}
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9575CD] text-xl">
            <FaLock />
          </span>
          <Input
            type="password"
            placeholder="Senha"
            value={loginForm.password}
            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            required
            className="pl-12 pr-4 py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
            style={{ boxShadow: '0 2px 16px #ede9fe' }}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-xl py-4 rounded-lg shadow-lg transition-all duration-200 mt-2"
          style={{ boxShadow: '0 8px 32px #9575CD44' }}
          disabled={loading}
        >
          Entrar
        </Button>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-[#9575CD] text-[#673AB7] font-bold text-lg py-4 rounded-lg bg-white shadow-md hover:bg-[#ede9fe] transition-all duration-200"
          disabled={loading}
        >
          <FcGoogle className="text-2xl" />
          Entrar com o Google
        </button>
      </form>
    </motion.div>
  );
}