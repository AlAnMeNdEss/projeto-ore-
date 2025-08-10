import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Plus, Sparkles, X, Pencil, Heart, Share2, TrendingUp, RefreshCw } from 'lucide-react';
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
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [devocional, setDevocional] = useState<string | null>(null);
  const [devocionalRef, setDevocionalRef] = useState<string>('');
  const [loadingDevocional, setLoadingDevocional] = useState(false);
  const [showDevocionalModal, setShowDevocionalModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.user_metadata?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [dailyImageUrl, setDailyImageUrl] = useState<string>('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80');
  const [selectedImageForSharing, setSelectedImageForSharing] = useState<string>('');
  const [shareTemplate, setShareTemplate] = useState<'image' | 'gradient' | 'minimal'>('image');
  const [shareAspect, setShareAspect] = useState<'square' | 'story'>('square');
  const refUpper = devocionalRef ? devocionalRef.toUpperCase() : '';

  // Banco de imagens royalty-free (Unsplash License)
  const DAILY_IMAGES: string[] = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441829266145-b8c5d2cf0f52?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80'
  ];

  // Contadores simulados para curtidas e compartilhamentos
  const [devocionalLikes] = useState(1031000); // 1.031M
  const [devocionalShares] = useState(421700); // 421,7mil

  function formatarNumero(n: number) {
    if (n >= 1000000) return (n / 1000000).toFixed(3).replace('.', ',').replace(/,\d+$/, 'M');
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.', ',') + 'mil';
    return n.toString();
  }

  // Seleção diária determinística
  const getDailySeed = () => Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));

  function selecionarImagemDia() {
    const seed = getDailySeed();
    const idx = seed % DAILY_IMAGES.length;
    setDailyImageUrl(DAILY_IMAGES[idx]);
  }

  // Versículo do dia
  async function carregarVersiculoDoDia() {
    setLoadingDevocional(true);
    try {
      const res = await fetch('/pt_nvi.json');
      const livros = await res.json();
      if (!Array.isArray(livros) || livros.length === 0) throw new Error('JSON de Bíblia inválido');

      const seed = getDailySeed();
      const livroIndex = seed % livros.length;
      const livro = livros[livroIndex];
      const capitulos = Array.isArray(livro.chapters) ? livro.chapters : [];
      if (capitulos.length === 0) throw new Error('Livro sem capítulos');

      const capIndex = Math.floor(seed / 3) % capitulos.length;
      const capObj = capitulos[capIndex];
      const capKey = Object.keys(capObj)[0];
      const versosMap = capObj[capKey] || {};
      const versoKeys = Object.keys(versosMap);
      if (versoKeys.length === 0) throw new Error('Capítulo sem versículos');

      const versoIndex = Math.floor(seed / 7) % versoKeys.length;
      const versoKey = versoKeys[versoIndex];

      const texto = versosMap[versoKey];
      const referencia = `${livro.book} ${capKey}:${versoKey}`;

      setDevocional(texto);
      setDevocionalRef(referencia);
    } catch (e) {
      console.error('Erro ao carregar versículo:', e);
      setDevocional('O Senhor é meu pastor, nada me faltará.');
      setDevocionalRef('Salmos 23:1');
    } finally {
      setLoadingDevocional(false);
    }
  }

  // Inicializar imagem selecionada quando o modal for aberto
  useEffect(() => {
    if (showDevocionalModal && !selectedImageForSharing) {
      setSelectedImageForSharing(dailyImageUrl);
    }
  }, [showDevocionalModal, dailyImageUrl, selectedImageForSharing]);

  function gerarDevocional() {
    selecionarImagemDia();
    carregarVersiculoDoDia();
  }

  // Resumo da comunidade (global)
  const fetchCommunitySummary = async () => {
    setLoadingSummary(true);
    try {
      const hoje = new Date().toISOString().slice(0, 10);
      const [{ count: novosPedidos }, { count: oracoesHoje }, { count: totalPedidos }, { count: totalOracoes }, { data: usuariosUnicos }] = await Promise.all([
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).gte('created_at', `${hoje}T00:00:00.000Z`).lte('created_at', `${hoje}T23:59:59.999Z`),
        supabase.from('prayer_interactions').select('id', { count: 'exact', head: true }).gte('created_at', `${hoje}T00:00:00.000Z`).lte('created_at', `${hoje}T23:59:59.999Z`),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }),
        supabase.from('prayer_interactions').select('id', { count: 'exact', head: true }),
        supabase.from('prayer_requests').select('user_id').not('user_id', 'is', null)
      ]);
      const totalUsuarios = usuariosUnicos ? new Set(usuariosUnicos.map(u => u.user_id)).size : 0;
      setCommunitySummary({
        oracoesHoje: oracoesHoje || 0,
        novosPedidos: novosPedidos || 0,
        totalOracoes: totalOracoes || 0,
        totalPedidos: totalPedidos || 0,
        totalUsuarios: totalUsuarios || 0,
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  // Inicialização
  useEffect(() => {
    selecionarImagemDia();
    carregarVersiculoDoDia();
    fetchCommunitySummary();

    const id = setInterval(() => {
      selecionarImagemDia();
      carregarVersiculoDoDia();
      fetchCommunitySummary();
    }, 60_000);
    return () => clearInterval(id);
  }, []);

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
    // Prioriza compartilhar o conteúdo do modal, se aberto; caso contrário, o card
    const element = document.getElementById('devocional-modal-share') || document.getElementById('devocional-img-share');
    if (!element) return;
    
    // Se não há imagem selecionada, usa a imagem do dia
    const imageToUse = selectedImageForSharing || dailyImageUrl;
    
    try {
      // Aplicar classe para melhorar nitidez durante a captura
      element.classList.add('share-clean');
      const canvas = await html2canvas(element, {useCORS: true, backgroundColor: null, foreignObjectRendering: true});
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const filesArray = [new File([blob], 'devocional.png', { type: 'image/png' })];
      const appLink = 'https://ore-plus.vercel.app';
      const shareText = `${devocional || 'Devocional Diário'}\n\n📱 Baixe o app ORE+: ${appLink}`;
      const shareData = {
        files: filesArray,
        title: 'Devocional Diário',
        text: shareText
      } as any;
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share(shareData);
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'devocional-ore-plus.png';
        a.click();
        alert(`Compartilhamento nativo indisponível. Baixamos a imagem para você compartilhar.\n\n📱 Baixe o app ORE+: ${appLink}`);
      }
    } catch (e) {
      alert('Erro ao compartilhar imagem.');
    } finally {
      element.classList.remove('share-clean');
    }
  }

  const nomeOuEmail = user?.user_metadata?.name || user?.email || 'Usuário';
  const primeiroNome = ((nomeOuEmail?.includes('@') ? nomeOuEmail.split('@')[0] : nomeOuEmail) || 'Usuário').split(' ')[0];

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
              Bem-vindo(a), {primeiroNome}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-white/90 font-normal" 
              style={{textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)'}}
            >
              É bom tê-lo(a) aqui.
            </motion.span>
          </div>

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
            <h2 className="mobile-text-medium text-gray-800">Resumo da Comunidade</h2>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-lg border border-gray-200 transition ${loadingSummary ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95'}`}
                onClick={() => !loadingSummary && fetchCommunitySummary()}
                aria-label="Atualizar resumo"
                title="Atualizar resumo"
                disabled={loadingSummary}
              >
                <RefreshCw className={`w-4 h-4 ${loadingSummary ? 'animate-spin text-gray-700' : 'text-gray-700'}`} />
              </button>
              <TrendingUp className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mobile-card p-4 text-center">
              <div className="mx-auto mb-2 w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {loadingSummary ? (
                <div className="mx-auto h-7 w-16 rounded-md bg-gray-200 animate-pulse" />
              ) : (
                <span className="mobile-text-large text-gray-900 leading-none">{formatarNumero(communitySummary.totalOracoes)}</span>
              )}
              <p className="mobile-text-medium text-gray-800 mt-1">Orações Totais</p>
            </div>
            <div className="mobile-card p-4 text-center">
              <div className="mx-auto mb-2 w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              {loadingSummary ? (
                <div className="mx-auto h-7 w-16 rounded-md bg-gray-200 animate-pulse" />
              ) : (
                <span className="mobile-text-large text-gray-900 leading-none">{formatarNumero(communitySummary.totalPedidos)}</span>
              )}
              <p className="mobile-text-medium text-gray-800 mt-1">Pedidos Totais</p>
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
          className="mobile-card overflow-hidden relative cursor-pointer"
          onClick={() => setShowDevocionalModal(true)}
        >
          <div className="w-full aspect-[4/3] relative flex items-center justify-center">
            <div
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                backgroundImage: `url(${dailyImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',
                zIndex: 1,
              }}
            />
            {/* Marca topo (incluída na captura) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 select-none">
              <span className="brand-mark text-white drop-shadow-lg font-extrabold uppercase" style={{ fontSize: 22 }}>
                ORE+
              </span>
            </div>
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pt-6 pb-20">
              {devocional && (
                <span className="px-4 py-3 bg-black/40 rounded-2xl text-gray-100 text-center mobile-text-small font-medium shadow-lg max-w-full drop-shadow-lg animate-fade-slide-in mb-4">
                  {devocional}
                </span>
              )}
              {!!refUpper && (
                <span className="brand-mark absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 font-bold tracking-widest text-[10px] select-none">
                  {refUpper}
                </span>
              )}
            </div>
            
            {/* Botões de interação */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center justify-center gap-8">
                <button className="flex flex-col items-center text-gray-300 hover:text-pink-400 transition-colors touch-ripple" onClick={(e) => e.stopPropagation()}>
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="mobile-text-caption">{formatarNumero(devocionalLikes)}</span>
                </button>
                <button 
                  className="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-colors touch-ripple"
                  onClick={(e) => { e.stopPropagation(); handleShareDevocional(); }}
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
            {(() => {
              const aspectClass = shareAspect === 'square' ? 'aspect-square' : 'aspect-[9/16]';
              const bgStyle = shareTemplate === 'image' 
                ? { backgroundImage: `url(${selectedImageForSharing || dailyImageUrl})` }
                : shareTemplate === 'gradient'
                  ? { backgroundImage: 'linear-gradient(135deg, #4338CA, #7C3AED, #06B6D4)' }
                  : { backgroundColor: '#0f172a' };
              const overlayClass = shareTemplate === 'image' ? 'bg-black/40' : 'bg-black/20';
              return (
                <div
                  id="devocional-modal-share"
                  className={`w-full ${aspectClass} bg-cover bg-center flex items-center justify-center relative rounded-2xl`}
                  style={bgStyle as any}
                >
                  <div className={`absolute inset-0 ${overlayClass} rounded-2xl`} />
                  {/* Marca topo (incluída na captura) */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 select-none">
                    <span className="brand-mark text-white drop-shadow-lg font-extrabold uppercase" style={{ fontSize: shareAspect==='story'?28:24 }}>
                      ORE+
                    </span>
                  </div>
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 text-center">
                    <span className="text-white font-semibold leading-relaxed" style={{
                      textShadow: '0 2px 8px rgba(0,0,0,.6)',
                      fontSize: shareAspect === 'square' ? 18 : 20,
                      maxWidth: shareAspect==='story'? 540 : 520
                    }}>
                      {devocional}
                    </span>
                    {!!refUpper && (
                      <span className="brand-mark absolute bottom-8 left-1/2 -translate-x-1/2 text-white/95 font-bold tracking-widest text-xs select-none">
                        {refUpper}
                      </span>
                    )}
                  </div>
                  {/* Controles sutis */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareAspect('square'); }}
                        className={`px-2 py-1 rounded-lg text-xs ${shareAspect==='square'?'bg-white text-gray-800':'text-white'}`}
                      >Quadrado</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareAspect('story'); }}
                        className={`px-2 py-1 rounded-lg text-xs ${shareAspect==='story'?'bg-white text-gray-800':'text-white'}`}
                      >Story</button>
                    </div>
                    <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareTemplate('minimal'); }}
                        className={`px-2 py-1 rounded-lg text-xs ${shareTemplate==='minimal'?'bg-white text-gray-800':'text-white'}`}
                      >Simples</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareTemplate('gradient'); }}
                        className={`px-2 py-1 rounded-lg text-xs ${shareTemplate==='gradient'?'bg-white text-gray-800':'text-white'}`}
                      >Gradiente</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareTemplate('image'); }}
                        className={`px-2 py-1 rounded-lg text-xs ${shareTemplate==='image'?'bg-white text-gray-800':'text-white'}`}
                      >Imagem</button>
                    </div>
                  </div>
                  
                  {/* Seletor de imagens */}
                  {shareTemplate === 'image' && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm rounded-2xl p-3">
                      <div className="text-center mb-2 flex items-center justify-between gap-3">
                        <span className="text-white text-xs font-medium">Escolha a imagem</span>
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedImageForSharing(dailyImageUrl);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                            selectedImageForSharing === dailyImageUrl 
                              ? 'bg-white text-gray-800' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                          title="Usar imagem do dia"
                        >
                          Dia
                        </button>
                      </div>
                      <div className="flex gap-2 max-w-[280px] overflow-x-auto pb-2">
                        {DAILY_IMAGES.map((imageUrl, index) => (
                          <button
                            key={index}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedImageForSharing(imageUrl);
                            }}
                            className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                              (selectedImageForSharing || dailyImageUrl) === imageUrl 
                                ? 'border-white shadow-lg scale-110' 
                                : 'border-white/30 hover:border-white/60'
                            }`}
                            style={{
                              backgroundImage: `url(${imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                            title={`Imagem ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button
                className="bg-black/60 hover:bg-black/80 rounded-full p-2 text-white touch-ripple"
                onClick={e => { e.stopPropagation(); handleShareDevocional(); }}
                aria-label="Compartilhar"
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="bg-black/60 hover:bg-black/80 rounded-full p-2 text-white touch-ripple"
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