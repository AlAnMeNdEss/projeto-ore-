import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SplashScreen } from '@/components/SplashScreen';

interface WelcomePageProps {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  const [loading, setLoading] = useState(false);

  function handleStart() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onStart();
    }, 1000); // 1 segundo de splash
  }

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden p-0"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Splash de carregamento */}
      {loading && <SplashScreen />}
      {/* Topo fixo */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center z-50 w-full px-6 py-5 bg-[#38b6ff] shadow-md">
        {/* Nome Ore+ no canto superior esquerdo */}
        <span className="text-3xl font-extrabold text-white tracking-wide select-none font-serif">Ore+</span>
        {/* Botão Entrar no canto superior direito */}
        <Button
          onClick={handleStart}
          className="bg-white hover:bg-gray-100 text-[#38b6ff] font-bold px-8 py-2 rounded-full shadow transition-all duration-200 text-xl font-sans border border-white"
        >
          Entrar
        </Button>
      </div>
      {/* Espaço para não sobrepor o conteúdo */}
      <div className="h-[80px] w-full" />
      {/* Conteúdo central - HERO BACKGROUND */}
      <div
        className="relative w-screen min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay desfocado */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(8px)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white text-center mb-8 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            A Sua<br />Comunidade de<br />Oração
          </h1>
          <p className="text-lg md:text-xl text-white text-center mb-10 font-sans max-w-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            Um espaço sagrado para partilhar pedidos, orar por outros e fortalecer a sua fé.
          </p>
          <div className="flex justify-center w-full">
            <Button
              className="bg-[#38b6ff] hover:bg-[#1e90ff] text-white font-bold text-2xl py-4 px-10 rounded-full shadow-lg transition-all duration-200 font-sans"
              onClick={handleStart}
            >
              Junte-se Agora
            </Button>
          </div>
        </div>
      </div>
      {/* Seção: Como Funciona? */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-screen bg-white mt-0 pt-10 pb-8 flex flex-col items-center z-20 relative"
        style={{ maxWidth: '100vw' }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#38b6ff] mb-4 text-center" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>Como Funciona?</h2>
        <p className="text-lg md:text-xl text-[#38b6ff] text-center mb-10" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.10)' }}>
          Em 3 passos simples,<br />
          você conecta-se em fé.
        </p>
        {/* Passo 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center w-full mb-16 card-anim"
        >
          <span className="w-24 h-24 rounded-full bg-[#38b6ff] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #38b6ff33, 0 2px 8px 0 #38b6ff22' }}>
            <span className="text-4xl md:text-5xl font-extrabold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>1</span>
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#38b6ff] text-center mb-5" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>Crie o seu Perfil</h3>
          <p className="text-lg md:text-xl text-[#38b6ff] text-center max-w-xl mb-2" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>
            Registe-se de forma rápida e segura.<br />
            A sua jornada de fé<br />
            começa aqui.
          </p>
        </motion.div>
        {/* Passo 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center w-full mb-16 card-anim"
        >
          <span className="w-24 h-24 rounded-full bg-[#38b6ff] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #38b6ff33, 0 2px 8px 0 #38b6ff22' }}>
            <span className="text-4xl md:text-5xl font-extrabold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>2</span>
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#38b6ff] text-center mb-5" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>Partilhe e Ore</h3>
          <p className="text-lg md:text-xl text-[#38b6ff] text-center max-w-xl mb-2" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>
            Publique os seus pedidos e interceda<br />
            pela comunidade.<br />
            Cada oração conta.
          </p>
        </motion.div>
        {/* Passo 3 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center w-full mb-0 card-anim"
        >
          <span className="w-24 h-24 rounded-full bg-[#38b6ff] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #38b6ff33, 0 2px 8px 0 #38b6ff22' }}>
            <span className="text-4xl md:text-5xl font-extrabold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>3</span>
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#38b6ff] text-center mb-5" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>Forme a sua Equipa</h3>
          <p className="text-lg md:text-xl text-[#38b6ff] text-center max-w-xl mb-2" style={{ textShadow: '0 2px 8px rgba(56,182,255,0.15)' }}>
            Crie grupos privados para orar com a sua família,<br />
            amigos ou membros<br />
            da igreja.
          </p>
        </motion.div>
      </motion.div>
      {/* Seção final: call to action, ocupa todo o final da página */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-screen min-h-[420px] flex flex-col items-center justify-center bg-[#38b6ff] px-4 py-16"
        style={{ maxWidth: '100vw' }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6">Pronto para se Conectar?</h2>
        <p className="text-lg md:text-2xl text-white text-center mb-10 max-w-2xl">
          Acesse o app no seu celular e<br />
          comece sua jornada com a gente
        </p>
        <button
          onClick={handleStart}
          className="bg-white hover:bg-gray-100 text-[#38b6ff] font-extrabold text-xl md:text-2xl px-10 py-4 rounded-full shadow-lg transition-all duration-200 border border-white"
          style={{ minWidth: '280px' }}
        >
          Entrar na Comunidade
        </button>
      </motion.div>
    </div>
  );
} 