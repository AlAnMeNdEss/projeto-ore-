import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const { signIn, signUp, user, sendPasswordResetEmail } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '', name: '' });
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
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
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
        <h1 className="font-logo text-6xl font-extrabold select-none mb-3">
          <span style={{ color: '#673AB7' }}>Ore</span>
          <span style={{ color: '#9575CD' }}>+</span>
        </h1>
        <p className="text-xl text-[#757575] text-center font-medium">{isLoginMode ? "A conectar corações em fé" : "Crie a sua conta de fé"}</p>
      </div>
      {/* Formulário */}
      <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="w-full max-w-md flex flex-col gap-6" autoComplete="on">
        
        {!isLoginMode && (
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#673AB7] text-2xl">
              <FaUser />
            </span>
            <Input
              type="text"
              placeholder="Nome Completo"
              value={registerForm.name}
              onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
              className="pl-12 pr-4 py-4 w-full bg-transparent text-gray-700 text-lg border-none focus:ring-0 placeholder:text-gray-500"
              disabled={loading}
            />
          </div>
        )}
        
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#673AB7] text-2xl">
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
            className="pl-12 pr-4 py-4 w-full bg-transparent text-gray-700 text-lg border-none focus:ring-0 placeholder:text-gray-500"
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#673AB7] text-2xl">
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
            className="pl-12 pr-4 py-4 w-full bg-transparent text-gray-700 text-lg border-none focus:ring-0 placeholder:text-gray-500"
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            disabled={loading}
          />
        </div>
        {!isLoginMode && (
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#673AB7] text-2xl">
              <FaLock />
            </span>
            <Input
              type="password"
              placeholder="Confirmar Senha"
              value={registerForm.confirmPassword}
              onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              required
              className="pl-12 pr-4 py-4 w-full bg-transparent text-gray-700 text-lg border-none focus:ring-0 placeholder:text-gray-500"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
        )}
        {isLoginMode && (
          <div className="text-right mt-4 mb-8">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-[#673AB7] hover:text-[#5e35b1] font-medium text-lg"
            >
              Esqueceu a senha?
            </button>
          </div>
        )}
          {showResetModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#EDE7F6] flex flex-col items-center justify-center z-50 px-4"
            >
              <div className="w-full max-w-md flex flex-col items-center">
                <h1 className="text-[#673AB7] text-5xl font-bold mb-4">Recuperar</h1>
                <h2 className="text-[#673AB7] text-5xl font-bold mb-12">Senha</h2>
                <p className="text-gray-600 text-2xl text-center mb-12">Insira o seu e-mail para continuar</p>
                <div className="w-full relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#673AB7] text-2xl">
                    <FaEnvelope />
                  </span>
                  <Input
                    type="email"
                    placeholder="O seu e-mail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-12 pr-4 py-4 w-full bg-transparent text-gray-700 text-lg border-none focus:ring-0 placeholder:text-gray-500"
                    disabled={loading}
                  />
                </div>
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
                  className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-2xl py-5 rounded-2xl transition-all duration-200 shadow-lg mb-8"
                  disabled={loading || !resetEmail}
                >
                  Enviar Link
                </Button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="text-[#673AB7] hover:text-[#5e35b1] font-medium text-2xl"
                >
                  Voltar ao Login
                </button>
              </div>
            </motion.div>
          )}
        <Button
          type="submit"
          className="w-full bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold text-2xl py-5 rounded-2xl transition-all duration-200 shadow-lg"
          disabled={loading}
        >
          {isLoginMode ? "Entrar" : "Criar Conta"}
        </Button>
        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg">
            {isLoginMode ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button 
              type="button" 
              onClick={toggleMode} 
              className="text-[#673AB7] hover:text-[#5e35b1] font-medium"
            >
              {isLoginMode ? "Crie uma agora" : "Entre aqui"}
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
}