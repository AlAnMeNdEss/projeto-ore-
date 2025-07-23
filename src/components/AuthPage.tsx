import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(false);
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(signupForm.email, signupForm.password, signupForm.name);
    setLoading(false);
    if (error) {
      setSignupError(error.message || 'Erro ao criar conta.');
    } else {
      setSignupSuccess(true);
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.resetPasswordForEmail(resetEmail);
    setResetSent(true);
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
      <motion.div {...fadeUp} className="mb-8 flex flex-col items-center">
        <h1 className="font-logo text-5xl font-extrabold select-none mb-2">
          <span style={{ color: '#673AB7' }}>Ore</span>
          <span style={{ color: '#9575CD' }}>+</span>
        </h1>
        <p className="text-lg text-[#757575] text-center font-medium mb-6">A conectar corações em fé</p>
      </motion.div>
      {mode === 'login' && (
        <motion.form {...fadeUp} onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
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
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
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
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-end">
            <button
              type="button"
              className="text-[#673AB7] font-semibold text-base hover:underline transition-all"
              onClick={() => setMode('reset')}
              disabled={loading}
            >
              Esqueci a senha
            </button>
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.4 }}>
            <Button
              type="submit"
              className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-xl py-4 rounded-lg shadow-lg transition-all duration-200 mt-2"
              style={{ boxShadow: '0 8px 32px #9575CD44' }}
              disabled={loading}
            >
              Entrar
            </Button>
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.5 }}>
            <button
              type="button"
              className="w-full text-[#757575] text-center font-medium mt-2 hover:underline"
              onClick={() => setMode('signup')}
              disabled={loading}
            >
              Criar conta
            </button>
          </motion.div>
        </motion.form>
      )}
      {mode === 'signup' && (
        <motion.form {...fadeUp} onSubmit={handleSignup} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.1 }}>
            <Input
              type="text"
              placeholder="Nome (opcional)"
              value={signupForm.name}
              onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
              className="py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              autoComplete="name"
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.2 }}>
            <Input
              type="email"
              placeholder="E-mail"
              value={signupForm.email}
              onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
              required
              className="py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              autoComplete="username"
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.3 }}>
            <Input
              type="password"
              placeholder="Senha"
              value={signupForm.password}
              onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
              required
              className="py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              autoComplete="new-password"
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.4 }}>
            <Input
              type="password"
              placeholder="Confirmar senha"
              value={signupForm.confirmPassword}
              onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              required
              className="py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              autoComplete="new-password"
              disabled={loading}
            />
          </motion.div>
          {signupError && (
            <div className="text-red-600 text-center font-medium mb-2">{signupError}</div>
          )}
          {signupSuccess && (
            <div className="text-green-600 text-center font-medium mb-2">
              Cadastro realizado! Verifique seu e-mail para confirmar sua conta.
            </div>
          )}
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.5 }}>
            <Button
              type="submit"
              className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-xl py-4 rounded-lg shadow-lg transition-all duration-200 mt-2"
              style={{ boxShadow: '0 8px 32px #9575CD44' }}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
            <button
              type="button"
              className="w-full text-[#757575] text-center font-medium mt-2 hover:underline"
              onClick={() => setMode('login')}
              disabled={loading}
            >
              Já tenho uma conta
            </button>
          </motion.div>
        </motion.form>
      )}
      {mode === 'reset' && (
        <motion.form {...fadeUp} onSubmit={handleReset} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.1 }}>
            <Input
              type="email"
              placeholder="Digite seu e-mail para redefinir a senha"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
              className="py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              autoComplete="username"
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, delay: 0.2 }}>
            <Button
              type="submit"
              className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-xl py-4 rounded-lg shadow-lg transition-all duration-200 mt-2"
              style={{ boxShadow: '0 8px 32px #9575CD44' }}
              disabled={loading}
            >
              Enviar link de redefinição
            </Button>
            {resetSent && (
              <p className="text-green-600 text-center font-medium">Verifique seu e-mail para redefinir a senha.</p>
            )}
            <button
              type="button"
              className="w-full text-[#757575] text-center font-medium mt-2 hover:underline"
              onClick={() => setMode('login')}
              disabled={loading}
            >
              Voltar para login
            </button>
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  );
}