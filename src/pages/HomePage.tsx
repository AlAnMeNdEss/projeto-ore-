import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Plus, Sparkles, X, Pencil, Heart, Share2, TrendingUp } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import loginBackground from '../assets/login-background.jpg';

interface HomePageProps {
  user: any;
  onFazerPedido: () => void;
  onVerComunidade: () => void;
}

export default function HomePage({ user, onFazerPedido, onVerComunidade }: HomePageProps) {
  const [communitySummary, setCommunitySummary] = useState({
    oracoesHoje: 0,
    novosPedidos: 0,
    totalOracoes: 0,
    totalPedidos: 0,
    totalUsuarios: 0,
  });
  const [devocional, setDevocional] = useState<string | null>(null);
  const [loadingDevocional, setLoadingDevocional] = useState(false);
  const [showDevocionalModal, setShowDevocionalModal] = useState(false);
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.user_metadata?.name || '');
  const [savingName, setSavingName] = useState(false);

  // Contadores simulados para curtidas e compartilhamentos
  const [devocionalLikes] = useState(1031000); // 1.031M
  const [devocionalShares] = useState(421700); // 421,7mil

  function formatarNumero(n: number) {
    if (n >= 1000000) return (n / 1000000).toFixed(3).replace('.', ',').replace(/,\d+$/, 'M');
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.', ',') + 'mil';
    return n.toString();
  }

  const DEVOCIONAIS = [
    '"Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento." (Provérbios 3:5)',
    '"O Senhor é o meu pastor; nada me faltará." (Salmos 23:1)',
    '"Entrega o teu caminho ao Senhor; confia nele, e o mais ele fará." (Salmos 37:5)',
    '"Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas." (Mateus 6:33)',
    '"Tudo posso naquele que me fortalece." (Filipenses 4:13)',
    '"Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração." (Romanos 12:12)',
    '"O Senhor está perto de todos os que o invocam, de todos os que o invocam com sinceridade." (Salmos 145:18)',
    '"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus." (Isaías 41:10)',
    '"Lâmpada para os meus pés é a tua palavra e luz para o meu caminho." (Salmos 119:105)',
    '"Deem graças ao Senhor porque ele é bom; o seu amor dura para sempre." (Salmos 136:1)',
    '"O choro pode durar uma noite, mas a alegria vem pela manhã." (Salmos 30:5)',
    '"Sede fortes e corajosos. Não temais, nem vos atemorizeis." (Deuteronômio 31:6)',
    '"O Senhor lutará por vocês; tão somente acalmem-se." (Êxodo 14:14)',
    '"Deleita-te no Senhor, e ele concederá os desejos do teu coração." (Salmos 37:4)',
    '"Aquietai-vos e sabei que eu sou Deus." (Salmos 46:10)',
    '"O Senhor é bom, um refúgio em tempos de angústia." (Naum 1:7)',
    '"Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará." (Salmos 91:1)',
    '"O Senhor te abençoe e te guarde." (Números 6:24)',
    '"O Senhor é a minha luz e a minha salvação; de quem terei medo?" (Salmos 27:1)',
    '"Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." (Salmos 46:1)',
  ];

  // Função para obter o versículo/reflexão do dia, sempre igual para todos os usuários
  function getDevocionalDoDia() {
    const hoje = new Date();
    const idx = (hoje.getFullYear() * 1000 + hoje.getMonth() * 31 + hoje.getDate()) % DEVOCIONAIS.length;
    return DEVOCIONAIS[idx];
  }

  useEffect(() => {
    setDevocional(getDevocionalDoDia());
  }, []);

  useEffect(() => {
    async function fetchCommunitySummary() {
      // Data de hoje no formato YYYY-MM-DD
      const hoje = new Date().toISOString().slice(0, 10);
      
      // Buscar número de pedidos de oração criados hoje
      const { count: novosPedidos } = await supabase
        .from('prayer_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', `${hoje}T00:00:00.000Z`)
        .lte('created_at', `${hoje}T23:59:59.999Z`);
      
      // Buscar número de orações feitas hoje
      const { count: oracoesHoje } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', `${hoje}T00:00:00.000Z`)
        .lte('created_at', `${hoje}T23:59:59.999Z`);
      
      // Buscar total global de pedidos
      const { count: totalPedidos } = await supabase
        .from('prayer_requests')
        .select('id', { count: 'exact', head: true });
      
      // Buscar total global de orações feitas pelos usuários (todas as interações de oração)
      const { count: totalOracoes } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true });
      
      // Buscar total de usuários únicos que fizeram login no app
      // Vamos usar uma abordagem mais simples: contar usuários únicos que criaram pedidos
      const { data: usuariosUnicos } = await supabase
        .from('prayer_requests')
        .select('user_id')
        .not('user_id', 'is', null);

      const totalUsuarios = usuariosUnicos ? new Set(usuariosUnicos.map(u => u.user_id)).size : 0;
      
      setCommunitySummary({
        oracoesHoje: oracoesHoje || 0,
        novosPedidos: novosPedidos || 0,
        totalOracoes: totalOracoes || 0,
        totalPedidos: totalPedidos || 0,
        totalUsuarios: totalUsuarios || 0,
      });
    }
    fetchCommunitySummary();
  }, []);

  function gerarDevocional() {
    setLoadingDevocional(true);
    setTimeout(() => {
      setDevocional('"Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento." (Provérbios 3:5)');
      setLoadingDevocional(false);
    }, 1200);
  }

  async function handleSaveName() {
    if (!user) return;
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { name: nameInput.trim() } });
    if (!error) {
      setEditingName(false);
    }
    setSavingName(false);
  }

  async function handleShareDevocional() {
    const element = document.getElementById('devocional-img-share');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {useCORS: true, backgroundColor: null, scale: 2});
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const filesArray = [new File([blob], 'devocional.png', { type: 'image/png' })];
      const shareData = {
        files: filesArray,
        title: 'Devocional Diário',
        text: devocional
      };
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share(shareData);
      } else {
        // Fallback: baixar imagem
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'devocional.png';
        a.click();
        alert('Compartilhamento não suportado neste dispositivo. Imagem baixada.');
      }
    } catch (e) {
      alert('Erro ao compartilhar imagem.');
    }
  }

  const nomeOuEmail = user?.user_metadata?.name || user?.email || 'Usuário';

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-0 relative overflow-x-hidden overflow-y-auto pb-[100px] mobile-scroll"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      {/* Status bar mobile */}
      <div className="mobile-status-bar safe-area-top" />
      
      {/* Header moderno */}
      <div className="mobile-container w-full">
        <div className="flex items-start justify-between w-full pt-8 pb-6 mb-4">
          <div className="flex flex-col gap-2">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-extrabold text-white leading-tight" 
              style={{letterSpacing: -1, textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'}}
            >
              Olá, {user?.user_metadata?.name || user?.email || 'Usuário'}!
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-white font-normal" 
              style={{textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)'}}
            >
              que a paz esteja consigo! 🙏
            </motion.span>
          </div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mobile-button-floating w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 touch-ripple" 
            aria-label="Perfil" 
            onClick={() => navigate('/perfil')}
          >
            <UserIcon className="w-6 h-6 text-blue-500" />
          </motion.button>
        </div>
      </div>

      {/* Container principal */}
      <div className="mobile-container w-full">
        {/* Card de Resumo da Comunidade */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mobile-card-glass w-full p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="mobile-text-medium text-blue-600">Resumo da Comunidade</h2>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <span className="mobile-text-large text-blue-600 leading-none">{communitySummary.totalOracoes}</span>
              <p className="mobile-text-caption text-blue-600 mt-1">Orações Totais</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <span className="mobile-text-large text-green-600 leading-none">{communitySummary.totalPedidos}</span>
              <p className="mobile-text-caption text-green-600 mt-1">Pedidos Totais</p>
            </div>
          </div>
        </motion.div>

        {/* Cards de ação */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mobile-card p-6 flex flex-col items-center justify-center touch-ripple hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={onFazerPedido}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="mobile-text-medium text-gray-800 text-center">Fazer<br/>Pedido</span>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mobile-card p-6 flex flex-col items-center justify-center touch-ripple hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={onVerComunidade}
          >
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="mobile-text-medium text-gray-800 text-center">Ver<br/>Comunidade</span>
          </motion.button>
        </div>

        {/* Card de Devocional Diário */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          id="devocional-img-share"
          className="mobile-card overflow-hidden relative"
        >
          <div className="w-full aspect-[4/3] relative flex items-center justify-center">
            <div
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                backgroundImage: 'url(https://th.bing.com/th/id/R.86a01e8b78df22918aff8d7f338054f0?rik=Q0Bo3%2bvuSIaRMA&pid=ImgRaw&r=0)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',
                zIndex: 1,
              }}
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pt-6 pb-20">
              <span className="mobile-text-caption text-gray-200 mb-2 drop-shadow-lg text-center">Versículo do Dia</span>
              <span className="mobile-text-medium text-gray-100 mb-3 drop-shadow-lg text-center">Salmos 33:5 NTLH</span>
              {devocional && (
                <span className="px-4 py-3 bg-black/40 backdrop-blur-sm rounded-2xl text-gray-100 text-center mobile-text-small font-medium shadow-lg max-w-full drop-shadow-lg animate-fade-slide-in mb-4">
                  {devocional}
                </span>
              )}
            </div>
            
            {/* Botões de interação */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center justify-center gap-8">
                <button className="flex flex-col items-center text-gray-300 hover:text-pink-400 transition-colors touch-ripple">
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="mobile-text-caption">{formatarNumero(devocionalLikes)}</span>
                </button>
                <button 
                  className="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-colors touch-ripple"
                  onClick={handleShareDevocional}
                >
                  <Share2 className="w-6 h-6 mb-1" />
                  <span className="mobile-text-caption">{formatarNumero(devocionalShares)}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de visualização do devocional */}
      {showDevocionalModal && (
        <div className="mobile-modal animate-fade-in">
          <div className="mobile-modal-content animate-bounce-in">
            <div
              className="w-full aspect-[4/5] bg-cover bg-center flex items-center justify-center relative rounded-2xl"
              style={{
                backgroundImage: 'url(https://th.bing.com/th/id/R.86a01e8b78df22918aff8d7f338054f0?rik=Q0Bo3%2bvuSIaRMA&pid=ImgRaw&r=0)',
              }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-2xl" />
              <div className="relative z-10 w-full flex flex-col items-center justify-center px-6">
                <span className="text-white mobile-text-large text-center drop-shadow-lg" style={{textShadow: '0 2px 8px #000'}}>
                  {devocional}
                </span>
              </div>
              <button
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white z-20 touch-ripple"
                onClick={e => { e.stopPropagation(); setShowDevocionalModal(false); }}
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 