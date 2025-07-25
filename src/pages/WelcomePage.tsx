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
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#18181b' }}
    >
      {/* Splash de carregamento */}
      {loading && <SplashScreen />}
      {/* Fundo animado */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{ background: '#18181b' }}
      />
      {/* Overlay colorido cinza escuro */}
      <div className="absolute inset-0 bg-[#23232b]/60 z-0" />
      {/* Topo fixo */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center z-50 w-full px-6 py-5 bg-[#23232b]/80 backdrop-blur-md shadow-md">
        {/* Nome Ore+ no canto superior esquerdo */}
        <span className="text-3xl font-extrabold text-gray-100 tracking-wide select-none font-serif">Ore+</span>
        {/* Botão Entrar no canto superior direito */}
        <Button
          onClick={handleStart}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-2 rounded-full shadow transition-all duration-200 text-xl font-sans"
        >
          Entrar
        </Button>
      </div>
      {/* Espaço para não sobrepor o conteúdo */}
      <div className="h-[80px] w-full" />
      {/* Conteúdo central */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center relative z-10 pt-32 pb-10">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-100 text-center mb-8 leading-tight drop-shadow-sm">
          A Sua<br />Comunidade de<br />Oração
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center mb-10 font-sans max-w-xl">
          Um espaço sagrado para partilhar pedidos, orar por outros e fortalecer a sua fé.
        </p>
        <Button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-2xl py-4 px-10 rounded-full shadow-lg transition-all duration-200 font-sans"
          onClick={handleStart}
        >
          Junte-se Agora
        </Button>
        {/* Mockup de iPhone moderno */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex justify-center w-full"
        >
          <div className="relative w-[210px] h-[440px] bg-[#27272a] rounded-[48px] border-[6px] border-[#23232b] flex flex-col items-center shadow-2xl overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black/80 opacity-80 z-10" />
            {/* Tela do celular */}
            <div className="flex-1 w-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-200 font-sans">Ore+ App</span>
            </div>
          </div>
        </motion.div>
        {/* Nova seção: Como funciona? */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="fixed left-0 right-0 w-screen bg-[#23232b] mt-16 pt-10 pb-8 flex flex-col items-center z-20 relative"
          style={{ maxWidth: '100vw' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 text-center">Como Funciona?</h2>
          <p className="text-lg md:text-xl text-gray-400 text-center mb-10">
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
            <span className="w-24 h-24 rounded-full bg-[#27272a] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #23232b, 0 2px 8px 0 #18181b' }}>
              <span className="text-4xl md:text-5xl font-extrabold text-gray-200">1</span>
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-100 text-center mb-5">Crie o seu Perfil</h3>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-xl mb-2">
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
            <span className="w-24 h-24 rounded-full bg-[#27272a] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #23232b, 0 2px 8px 0 #18181b' }}>
              <span className="text-4xl md:text-5xl font-extrabold text-gray-200">2</span>
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-100 text-center mb-5">Partilhe e Ore</h3>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-xl mb-2">
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
            <span className="w-24 h-24 rounded-full bg-[#27272a] flex items-center justify-center mb-8" style={{ boxShadow: '0 4px 24px 0 #23232b, 0 2px 8px 0 #18181b' }}>
              <span className="text-4xl md:text-5xl font-extrabold text-gray-200">3</span>
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-100 text-center mb-5">Forme a sua Equipa</h3>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-xl mb-2">
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
          className="w-screen min-h-[420px] flex flex-col items-center justify-center bg-gradient-to-b from-[#23232b] to-[#18181b] px-4 py-16"
          style={{ maxWidth: '100vw' }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 text-center mb-6">Pronto para se Conectar?</h2>
          <p className="text-lg md:text-2xl text-gray-300 text-center mb-10 max-w-2xl">
            Aceda ao PWA no seu telemóvel e<br />
            comece a sua jornada de fé connosco hoje.
          </p>
          <button
            onClick={handleStart}
            className="bg-gray-100 text-[#23232b] font-extrabold text-xl md:text-2xl px-10 py-4 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-200"
            style={{ minWidth: '280px' }}
          >
            Entrar na Comunidade
          </button>
        </motion.div>
      </div>
    </div>
  );
} 