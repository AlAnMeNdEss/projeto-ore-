import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Plus, Sparkles } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';

interface HomePageProps {
  user: any;
}

export default function HomePage({ user }: HomePageProps) {
  const [communitySummary] = useState({
    oracoesHoje: 52,
    novosPedidos: 3,
  });
  const [devocional, setDevocional] = useState<string | null>(null);
  const [loadingDevocional, setLoadingDevocional] = useState(false);

  function gerarDevocional() {
    setLoadingDevocional(true);
    setTimeout(() => {
      setDevocional('"Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento." (Provérbios 3:5)');
      setLoadingDevocional(false);
    }, 1200);
  }

  const nomeOuEmail = user?.user_metadata?.name || user?.email || 'Usuário';

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-0 relative gradient-bg overflow-x-hidden overflow-y-auto bg-[#f6eaff] pb-[90px]"
      style={{
        background: 'linear-gradient(180deg, #F6EAFF 0%, #E9D8FD 100%)',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-start pt-8 pb-2 px-4" style={{minHeight: 180}}>
        <div className="w-full flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#23232b] leading-tight mb-1" style={{letterSpacing: -1}}>Olá, {nomeOuEmail}!</h1>
            <p className="text-xl text-[#6d6d7b] font-medium">que a paz esteja consigo!</p>
          </div>
          <button className="rounded-full bg-transparent p-2 mt-1" aria-label="Perfil">
            <UserIcon className="w-8 h-8 text-[#8b5cf6]" />
          </button>
        </div>
        {/* Card de Resumo da Comunidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center mb-6"
          style={{boxShadow: '0 4px 32px #e9d8fd'}}
        >
          <h2 className="text-2xl font-bold text-[#6d28d9] mb-2 text-center" style={{letterSpacing: -0.5}}>Resumo da Comunidade</h2>
          <div className="flex w-full justify-around mt-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-[#6d28d9] leading-none">{communitySummary.oracoesHoje}</span>
              <span className="text-lg text-[#6d28d9] mt-1">Orações hoje</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-[#6d28d9] leading-none">{communitySummary.novosPedidos}</span>
              <span className="text-lg text-[#6d28d9] mt-1">Novos Pedidos</span>
            </div>
          </div>
        </motion.div>
        {/* Dois cards de ação sempre lado a lado */}
        <div className="w-full flex flex-row gap-4 mb-6 max-w-xl mx-auto">
          <div className="flex-1 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center py-10 px-4 min-w-[140px]" style={{boxShadow: '0 4px 32px #e9d8fd'}}>
            <Plus className="w-10 h-10 text-[#8b5cf6] mb-3" />
            <span className="text-2xl font-bold text-[#6d28d9] text-center leading-tight">Fazer um<br/>Pedido</span>
          </div>
          <div className="flex-1 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center py-10 px-4 min-w-[140px]" style={{boxShadow: '0 4px 32px #e9d8fd'}}>
            <Users className="w-10 h-10 text-[#8b5cf6] mb-3" />
            <span className="text-2xl font-bold text-[#6d28d9] text-center leading-tight">Ver<br/>Comunidade</span>
          </div>
        </div>
        {/* Card de Devocional Diário no mesmo padrão dos outros cards */}
        <div className="w-full bg-white rounded-3xl shadow-lg flex flex-col items-center p-6 mb-4" style={{boxShadow: '0 4px 32px #e9d8fd'}}>
          <h3 className="text-lg font-bold text-[#a084e8] mb-4 text-center tracking-wide">DEVOCIONAL DIÁRIO</h3>
          <p className="text-lg text-[#23232b] text-center mb-6 leading-relaxed">
            Toque no botão abaixo<br />para gerar uma reflexão<br />para o seu dia.
          </p>
          <Button
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
            style={{maxWidth: 340}}
            onClick={gerarDevocional}
            disabled={loadingDevocional}
          >
            <Sparkles className="w-5 h-5" />
            {loadingDevocional ? 'Gerando...' : 'Gerar reflexão com IA'}
          </Button>
          {devocional && (
            <div className="mt-6 p-4 bg-[#ede9fe] rounded-xl text-[#2d1457] text-center text-base font-medium shadow">
              {devocional}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 