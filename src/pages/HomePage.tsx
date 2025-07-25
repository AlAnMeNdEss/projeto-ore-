import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Plus, Sparkles, X, Pencil } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';

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
      // Buscar total global de orações feitas
      const { count: totalOracoes } = await supabase
        .from('prayer_interactions')
        .select('id', { count: 'exact', head: true });
      setCommunitySummary({
        oracoesHoje: oracoesHoje || 0,
        novosPedidos: novosPedidos || 0,
        totalOracoes: totalOracoes || 0,
        totalPedidos: totalPedidos || 0,
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
      className="min-h-screen w-full flex flex-col items-center justify-start px-0 relative gradient-bg overflow-x-hidden overflow-y-auto bg-[#f6eaff] pb-[90px]"
      style={{
        background: 'linear-gradient(180deg, #F6EAFF 0%, #E9D8FD 100%)',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      {/* Topo estilizado igual ao exemplo da imagem, com padding lateral igual aos cards */}
      <div className="w-full max-w-md mx-auto px-2">
        <div className="rounded-t-3xl bg-[#f6eaff] flex flex-col px-4 pt-6 pb-4 mb-2" style={{boxShadow: '0 2px 12px #e9d8fd'}}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#23232b] leading-tight" style={{letterSpacing: -1}}>
                Olá, {user?.user_metadata?.name || user?.email || 'Usuário'}!
              </span>
              <span className="text-lg sm:text-xl text-[#6d6d7b] font-normal mt-1">que a paz esteja consigo!</span>
            </div>
            <button className="rounded-full bg-transparent p-2 mt-1" aria-label="Perfil" onClick={() => navigate('/perfil')}>
              <UserIcon className="w-8 h-8 text-[#8b5cf6]" />
            </button>
          </div>
        </div>
      </div>
      {/* Saudação removida daqui, agora está no topo */}
      {/* Container principal com padding lateral igual para todos os cards e imagem */}
      <div className="w-full max-w-md mx-auto px-2">
        {/* Card de Resumo da Comunidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-5 flex flex-col items-center mb-4 border border-purple-200 mt-8"
          style={{boxShadow: '0 2px 16px #e9d8fd'}}
        >
          <h2 className="text-lg font-bold text-[#6d28d9] mb-2 text-center" style={{letterSpacing: -0.5}}>Resumo da Comunidade</h2>
          <div className="flex w-full justify-around mt-4 gap-4 border-t border-purple-100 pt-3">
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-[#6d28d9] leading-none">{communitySummary.totalOracoes}</span>
              <span className="text-xs text-[#6d28d9] mt-1">Orações Totais</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-[#6d28d9] leading-none">{communitySummary.totalPedidos}</span>
              <span className="text-xs text-[#6d28d9] mt-1">Pedidos Totais</span>
            </div>
          </div>
        </motion.div>
        {/* Dois cards de ação lado a lado */}
        <div className="w-full flex flex-row gap-4 mb-4">
          <button
            className="flex-1 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-md flex flex-col items-center justify-center py-6 px-3 min-w-[110px] border border-purple-200 hover:scale-105 transition-transform duration-200"
            style={{boxShadow: '0 2px 12px #e9d8fd'}}
            onClick={onFazerPedido}
          >
            <Plus className="w-8 h-8 text-[#8b5cf6] mb-2" />
            <span className="text-lg font-bold text-[#6d28d9] text-center leading-tight">Fazer<br/>Pedido</span>
          </button>
          <button
            className="flex-1 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-md flex flex-col items-center justify-center py-6 px-3 min-w-[110px] border border-purple-200 hover:scale-105 transition-transform duration-200"
            style={{boxShadow: '0 2px 12px #e9d8fd'}}
            onClick={onVerComunidade}
          >
            <Users className="w-8 h-8 text-[#8b5cf6] mb-2" />
            <span className="text-lg font-bold text-[#6d28d9] text-center leading-tight">Ver<br/>Comunidade</span>
          </button>
        </div>
        {/* Card de Devocional Diário estilo antigo, centralizado, mantendo proporções e botões na base */}
        <div
          id="devocional-img-share"
          className="w-full rounded-2xl shadow-lg flex flex-col items-center p-0 mb-4 overflow-hidden relative border border-purple-200"
          style={{boxShadow: '0 4px 24px #e9d8fd'}}
        >
          <div className="w-full aspect-[5/3] relative flex items-center justify-center">
            <div
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              style={{
                backgroundImage: 'url(https://th.bing.com/th/id/R.86a01e8b78df22918aff8d7f338054f0?rik=Q0Bo3%2bvuSIaRMA&pid=ImgRaw&r=0)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',
                zIndex: 1,
              }}
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pt-4 pb-4">
              <span className="text-base font-semibold text-white/90 mb-1 drop-shadow-lg text-center" style={{letterSpacing: 0.5}}>Versículo do Dia</span>
              <span className="text-xl font-bold text-white mb-2 drop-shadow-lg text-center">Salmos 33:5 NTLH</span>
              {devocional && (
                <span className="px-3 py-2 bg-black/30 rounded-xl text-white text-center text-base font-medium shadow-lg max-w-full drop-shadow-lg animate-fade-slide-in mb-2" style={{backdropFilter: 'blur(2px)'}}>
                  {devocional}
                </span>
              )}
            </div>
            {/* Botões na parte de baixo da imagem com contadores simulados */}
            <div className="w-full flex items-center justify-center gap-16 py-3 bg-gradient-to-t from-black/40 to-transparent absolute left-0 bottom-0 z-20">
              <div className="flex flex-col items-center">
                <button
                  className="flex flex-col items-center text-white hover:text-pink-400 transition"
                  aria-label="Curtir devocional"
                  // onClick={...} // Aqui pode adicionar lógica de curtir se desejar
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                  </svg>
                </button>
                <span className="text-white text-base font-semibold mt-1 select-none">{formatarNumero(devocionalLikes)}</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="flex flex-col items-center text-white hover:text-[#a084e8] transition"
                  onClick={handleShareDevocional}
                  aria-label="Compartilhar devocional"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M8.464 8.464l.01.01M15.536 8.464l.01.01M15.536 15.536l.01.01M8.464 15.536l.01.01" />
                  </svg>
                </button>
                <span className="text-white text-base font-semibold mt-1 select-none">{formatarNumero(devocionalShares)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Remover botão de compartilhar abaixo da imagem */}
      </div>
      {/* Modal de visualização do devocional em destaque */}
      {showDevocionalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-slide-in">
          <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="w-full aspect-[4/5] bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage: 'url(https://th.bing.com/th/id/R.86a01e8b78df22918aff8d7f338054f0?rik=Q0Bo3%2bvuSIaRMA&pid=ImgRaw&r=0)',
              }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-3xl" />
              <div className="relative z-10 w-full flex flex-col items-center justify-center px-6">
                <span className="text-white text-xl sm:text-2xl font-bold text-center drop-shadow-lg" style={{textShadow: '0 2px 8px #000'}}>
                  {devocional}
                </span>
              </div>
              <button
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white z-20"
                onClick={e => { e.stopPropagation(); setShowDevocionalModal(false); }}
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 