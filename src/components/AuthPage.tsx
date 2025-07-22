import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaLock } from 'react-icons/fa';

import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const { signIn, signUp, user, sendPasswordResetEmail } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResetModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(registerForm.email, registerForm.password, registerForm.name);
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
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
      <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
        <h2 className="text-2xl font-bold text-center text-[#673AB7] mb-4">
          {isLoginMode ? "Entrar" : "Criar Conta"}
        </h2>
        
        {!isLoginMode && (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9575CD] text-xl">
              <FaEnvelope />
            </span>
            <Input
              type="text"
              placeholder="Nome completo"
              value={registerForm.name}
              onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
              className="pl-12 pr-4 py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
              style={{ boxShadow: '0 2px 16px #ede9fe' }}
              disabled={loading}
            />
          </div>
        )}
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9575CD] text-xl">
            <FaEnvelope />
          </span>
          <Input
            type="email"
            placeholder="E-mail"
            value={isLoginMode ? loginForm.email : registerForm.email}
            onChange={e => isLoginMode 
              ? setLoginForm({ ...loginForm, email: e.target.value })
              : setRegisterForm({ ...registerForm, email: e.target.value })
            }
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
            value={isLoginMode ? loginForm.password : registerForm.password}
            onChange={e => isLoginMode 
              ? setLoginForm({ ...loginForm, password: e.target.value })
              : setRegisterForm({ ...registerForm, password: e.target.value })
            }
            required
            className="pl-12 pr-4 py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
            style={{ boxShadow: '0 2px 16px #ede9fe' }}
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            disabled={loading}
          />
        </div>
        {isLoginMode && (
          <div className="text-right mt-[-10px] mb-4">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-[#673AB7] hover:underline font-medium"
            >
              Esqueci a senha
            </button>
          </div>
        )}
          {showResetModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowResetModal(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              >
                <h3 className="text-xl font-semibold text-[#673AB7] mb-4">Redefinir Senha</h3>
                <p className="text-gray-600 mb-4">Digite seu e-mail para receber as instruções de redefinição de senha.</p>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9575CD] text-xl">
                    <FaEnvelope />
                  </span>
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-12 pr-4 py-4 rounded-lg bg-white/70 text-gray-700 text-lg shadow-md border-none focus:ring-2 focus:ring-[#9575CD] placeholder:text-gray-400"
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      if (resetEmail) {
                        setLoading(true);
                        await sendPasswordResetEmail(resetEmail);
                        setLoading(false);
                        setShowResetModal(false);
                        setResetEmail('');
                      }
                    }}
                    className="flex-1 bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold py-2 px-4 rounded-lg"
                    disabled={loading || !resetEmail}
                  >
                    Enviar
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        <Button
          type="submit"
          className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-xl py-4 rounded-lg shadow-lg transition-all duration-200 mt-2"
          style={{ boxShadow: '0 8px 32px #9575CD44' }}
          disabled={loading}
        >
          {isLoginMode ? "Entrar" : "Criar Conta"}
        </Button>
        <div className="text-center mt-4">
          <button 
            type="button" 
            onClick={toggleMode} 
            className="text-[#673AB7] hover:underline font-medium"
          >
            {isLoginMode 
              ? "Ainda não tem conta? Crie uma aqui" 
              : "Já tem uma conta? Entre aqui"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}