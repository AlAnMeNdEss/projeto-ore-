import React, { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useRef } from 'react';

const traducoes = [
  // Português
  { value: 'almeida_ra', label: 'Almeida RA (Português)' },
  { value: 'almeida_rc', label: 'Almeida RC (Português)' },
  { value: 'blivre', label: 'Bíblia Livre (Português)' },
  // Inglês
  { value: 'kjv', label: 'King James (KJV) (Inglês)' },
  { value: 'kjv_strongs', label: 'KJV com Strongs (Inglês)' },
  { value: 'asv', label: 'American Standard Version (Inglês)' },
  { value: 'geneva', label: 'Geneva Bible (Inglês)' },
  { value: 'web', label: 'World English Bible (Inglês)' },
  { value: 'bishops', label: 'Bishops Bible (Inglês)' },
  { value: 'coverdale', label: 'Coverdale Bible (Inglês)' },
  { value: 'tyndale', label: 'Tyndale Bible (Inglês)' },
];

const livros = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cânticos', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom',
  'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse'
];

// Função utilitária para limpar tags HTML e caracteres especiais
function limparTexto(texto: string) {
  return texto
    .replace(/<[^>]+>/g, '') // Remove tags HTML
    .replace(/¶/g, '') // Remove símbolo de parágrafo
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

export function Biblia({ setShowNavBar, onShowNavBar }: { setShowNavBar?: Dispatch<SetStateAction<boolean>>; onShowNavBar?: (show: boolean) => void }) {
  const [traducao, setTraducao] = useState('almeida_ra');
  
  // Carregar posição salva ou usar padrão
  const [livro, setLivro] = useState(() => {
    try {
      return localStorage.getItem('bibliaLivro') || 'Salmos';
    } catch {
      return 'Salmos';
    }
  });
  
  const [capitulo, setCapitulo] = useState(() => {
    try {
      return Number(localStorage.getItem('bibliaCapitulo')) || 23;
    } catch {
      return 23;
    }
  });
  
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [pending, setPending] = useState(false);
  const [lastVersiculos, setLastVersiculos] = useState<any[]>([]);

  // Salvar posição quando livro ou capítulo mudar
  useEffect(() => {
    try {
      localStorage.setItem('bibliaLivro', livro);
      localStorage.setItem('bibliaCapitulo', capitulo.toString());
    } catch (error) {
      console.error('Erro ao salvar posição:', error);
    }
  }, [livro, capitulo]);

  // Restaurar posição de scroll quando versículos carregarem
  useEffect(() => {
    if (versiculos.length > 0 && !loading) {
      try {
        const scrollPosition = localStorage.getItem('bibliaScrollPosition');
        if (scrollPosition) {
          setTimeout(() => {
            window.scrollTo(0, Number(scrollPosition));
          }, 100);
        }
      } catch (error) {
        console.error('Erro ao restaurar scroll:', error);
      }
    }
  }, [versiculos, loading]);

  // Salvar posição de scroll quando sair da página
  useEffect(() => {
    function handleBeforeUnload() {
      try {
        localStorage.setItem('bibliaScrollPosition', window.scrollY.toString());
      } catch (error) {
        console.error('Erro ao salvar scroll:', error);
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        try {
          localStorage.setItem('bibliaScrollPosition', window.scrollY.toString());
        } catch (error) {
          console.error('Erro ao salvar scroll:', error);
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Salvar scroll periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        localStorage.setItem('bibliaScrollPosition', window.scrollY.toString());
      } catch (error) {
        console.error('Erro ao salvar scroll:', error);
      }
    }, 5000); // Salva a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Versículos marcados com cor (favoritos) salvos no localStorage
  const [marcados, setMarcados] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('versiculosMarcadosCor') || '{}');
    } catch {
      return {};
    }
  });
  const [menuCor, setMenuCor] = useState<{id: string, top: number, left: number, showCores: boolean} | null>(null);
  const [iaPergunta, setIaPergunta] = useState<{id: string, pergunta: string, resposta: string, loading: boolean} | null>(null);
  const [showVersaoMenu, setShowVersaoMenu] = useState(false);
  // 0 = amarelo, 1 = escuro, 2 = branco
  const [themeMode, setThemeMode] = useState(0);
  const darkMode = themeMode === 1;
  const whiteMode = themeMode === 2;

  // Adicionar estado para mostrar botão de marcação
  const [showMarkButton, setShowMarkButton] = useState<string | null>(null);

  function marcarComCor(versiculoId: string, cor: string) {
    setMarcados(prev => {
      const novo = { ...prev, [versiculoId]: cor };
      localStorage.setItem('versiculosMarcadosCor', JSON.stringify(novo));
      return novo;
    });
    setShowMarkButton(null);
  }

  function handleHold(e: React.MouseEvent | React.TouchEvent, id: string) {
    e.preventDefault();
    
    // Vibrar no mobile antes de ativar
    if ('touches' in e && navigator.vibrate) {
      navigator.vibrate(100); // Vibração de 100ms
    }
    
    let top = 0, left = 0;
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      top = touch.clientY;
      left = touch.clientX;
    } else if ('clientY' in e) {
      top = e.clientY;
      left = e.clientX;
    }
    setMenuCor(prev => {
      if (!prev || prev.id !== id) {
        return { id, top, left, showCores: false };
      }
      // Se já está aberto para esse id, não faz nada
      return prev;
    });
  }

  function handleClick(e: React.MouseEvent | React.TouchEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    
    // Vibrar no mobile
    if ('touches' in e && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    let top = 0, left = 0;
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      top = touch.clientY;
      left = touch.clientX;
    } else if ('clientY' in e) {
      top = e.clientY;
      left = e.clientX;
    }
    
    setMenuCor(prev => {
      if (!prev || prev.id !== id) {
        return { id, top, left, showCores: false };
      }
      return prev;
    });
  }

  async function perguntarIA(versiculo: string, pergunta: string) {
    setIaPergunta(prev => prev && { ...prev, loading: true, resposta: '' });
    try {
      const prompt = `Responda à seguinte pergunta sobre este versículo bíblico: \n"${versiculo}"\nPergunta: ${pergunta}`;
      const res = await fetch('/api/ia-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setIaPergunta(prev => prev && { ...prev, resposta: data.texto || 'Sem resposta', loading: false });
    } catch {
      setIaPergunta(prev => prev && { ...prev, resposta: 'Erro ao consultar IA', loading: false });
    }
  }

  // Tema de leitura confortável (amarelado)
  const [temaLeitura, setTemaLeitura] = useState(() => {
    try {
      return localStorage.getItem('temaLeituraBiblia') === 'amarelo';
    } catch {
      return false;
    }
  });
  function toggleTemaLeitura() {
    setTemaLeitura((prev) => {
      localStorage.setItem('temaLeituraBiblia', !prev ? 'amarelo' : 'padrao');
      return !prev;
    });
  }

  // Número de capítulos por livro (exemplo para os principais livros, adicione mais conforme necessário)
  const capitulosPorLivro: Record<string, number> = {
    'Gênesis': 50, 'Êxodo': 40, 'Levítico': 27, 'Números': 36, 'Deuteronômio': 34, 'Josué': 24, 'Juízes': 21, 'Rute': 4,
    '1 Samuel': 31, '2 Samuel': 24, '1 Reis': 22, '2 Reis': 25, '1 Crônicas': 29, '2 Crônicas': 36, 'Esdras': 10, 'Neemias': 13, 'Ester': 10, 'Jó': 42, 'Salmos': 150, 'Provérbios': 31, 'Eclesiastes': 12, 'Cânticos': 8, 'Isaías': 66, 'Jeremias': 52, 'Lamentações': 5, 'Ezequiel': 48, 'Daniel': 12, 'Oseias': 14, 'Joel': 3, 'Amós': 9, 'Obadias': 1, 'Jonas': 4, 'Miquéias': 7, 'Naum': 3, 'Habacuque': 3, 'Sofonias': 3, 'Ageu': 2, 'Zacarias': 14, 'Malaquias': 4,
    'Mateus': 28, 'Marcos': 16, 'Lucas': 24, 'João': 21, 'Atos': 28, 'Romanos': 16, '1 Coríntios': 16, '2 Coríntios': 13, 'Gálatas': 6, 'Efésios': 6, 'Filipenses': 4, 'Colossenses': 4, '1 Tessalonicenses': 5, '2 Tessalonicenses': 3, '1 Timóteo': 6, '2 Timóteo': 4, 'Tito': 3, 'Filemom': 1, 'Hebreus': 13, 'Tiago': 5, '1 Pedro': 5, '2 Pedro': 3, '1 João': 5, '2 João': 1, '3 João': 1, 'Judas': 1, 'Apocalipse': 22
  };

  // Capítulos válidos para o livro selecionado
  const capitulos = Array.from({ length: capitulosPorLivro[livro] || 1 }, (_, i) => i + 1);

  const [internalShowNavBar, internalSetShowNavBar] = useState(true);
  // Se onShowNavBar está presente, a visibilidade é controlada externamente; senão, é local
  const showNavBar = onShowNavBar ? undefined : internalShowNavBar;
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      if (onShowNavBar) {
        if (currentY > lastScrollY.current && currentY > 80) {
          onShowNavBar(false);
        } else {
          onShowNavBar(true);
        }
      } else if (setShowNavBar) {
        if (currentY > lastScrollY.current && currentY > 80) {
          setShowNavBar(false);
        } else {
          setShowNavBar(true);
        }
      } else {
        if (currentY > lastScrollY.current && currentY > 80) {
          internalSetShowNavBar(false);
        } else {
          internalSetShowNavBar(true);
        }
      }
      lastScrollY.current = currentY;
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setShowNavBar, onShowNavBar]);

  // Estado para mostrar/ocultar a barra de capítulos
  const [showCapituloBar, setShowCapituloBar] = useState(true);
  const lastScrollYCap = useRef(0);

  useEffect(() => {
    function handleScrollCap() {
      const currentY = window.scrollY;
      if (currentY > lastScrollYCap.current && currentY > 80) {
        setShowCapituloBar(false);
      } else {
        setShowCapituloBar(true);
      }
      lastScrollYCap.current = currentY;
    }
    window.addEventListener('scroll', handleScrollCap);
    return () => window.removeEventListener('scroll', handleScrollCap);
  }, []);

  useEffect(() => {
    let cancelado = false;
    let loadingTimeout: any;
    setPending(true);
    loadingTimeout = setTimeout(() => {
      if (!cancelado) setLoading(true);
    }, 400);
    async function fetchVersiculos() {
      setErro('');
      setVersiculos([]);
      try {
        let url = '';
        if (busca.trim() !== '') {
          setBuscando(true);
          // Usar a API local para busca
          url = `http://localhost:3001/api/biblia/busca?termo=${encodeURIComponent(busca.trim())}&traducao=${traducao}`;
        } else {
          setBuscando(false);
          // Usar a API local para versículos
          url = `http://localhost:3001/api/biblia?livro=${encodeURIComponent(livro)}&capitulo=${capitulo}&traducao=${traducao}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (cancelado) return;
        
        if (data.error) {
          setErro(data.error);
          setVersiculos([]);
        } else {
          if (busca.trim() !== '') {
            // Resultado de busca
            setVersiculos(data);
            setLastVersiculos(data);
          } else {
            // Resultado de capítulo
            setVersiculos(data);
            setLastVersiculos(data);
          }
        }
      } catch (e) {
        if (!cancelado) setErro('Erro ao buscar versículos. Verifique se a API está rodando.');
      }
      if (!cancelado) setLoading(false);
      if (!cancelado) setPending(false);
      clearTimeout(loadingTimeout);
    }
    fetchVersiculos();
    return () => { cancelado = true; clearTimeout(loadingTimeout); };
  }, [livro, capitulo, traducao, busca]);

  function copiarVersiculo(texto: string, livro: string, capitulo: number, versiculo: string) {
    const textoCompleto = `${livro} ${capitulo}:${versiculo} - ${texto}

📖 Encontrei este versículo no Silent Prayers - Oração Silenciosa
📱 Baixe o app: https://silent-prayers.vercel.app`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoCompleto).then(() => {
        // Feedback visual ou sonoro de sucesso
        console.log('Versículo copiado com sucesso!');
      }).catch(err => {
        console.error('Erro ao copiar:', err);
        // Fallback para navegadores mais antigos
        copiarFallback(textoCompleto);
      });
    } else {
      // Fallback para navegadores que não suportam clipboard API
      copiarFallback(textoCompleto);
    }
  }

  function copiarFallback(texto: string) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Versículo copiado com sucesso!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
    
    document.body.removeChild(textArea);
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center px-2 pt-6 overflow-y-auto relative ${darkMode ? 'bg-[#23232b]' : whiteMode ? 'bg-white' : 'bg-[#fdf6e3]'}` }>
      {/* Botões de versão/tradução e tema escuro */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button
          className="bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-opacity opacity-80 hover:opacity-100"
          title="Escolher versão/tradução"
          onClick={() => setShowVersaoMenu(v => !v)}
          aria-label="Escolher versão/tradução"
        >
          {/* Ícone de livro aberto */}
          <svg width="24" height="24" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 19V6a2 2 0 0 1 2-2h7"/><path d="M22 19V6a2 2 0 0 0-2-2h-7"/><path d="M2 19a2 2 0 0 0 2 2h7"/><path d="M22 19a2 2 0 0 1-2 2h-7"/></svg>
        </button>
        <button
          className="bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-opacity opacity-80 hover:opacity-100"
          title="Alternar tema de leitura"
          onClick={() => setThemeMode(m => (m + 1) % 3)}
          aria-label="Alternar tema de leitura"
        >
          {/* Ícone de tema: amarelo = sun, escuro = moon, branco = sun-outline */}
          {themeMode === 0 && (
            <svg width="22" height="22" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          )}
          {themeMode === 1 && (
            <svg width="22" height="22" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          )}
          {themeMode === 2 && (
            <svg width="22" height="22" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          )}
        </button>
      </div>
      {/* Menu de versões/traduções */}
      {showVersaoMenu && (
        <div className="absolute top-14 right-4 z-40 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[220px]">
          <div className="font-bold text-[#23232b] mb-2">Versão/Tradução</div>
          <select
            className="w-full rounded-lg border border-[#ececec] bg-white text-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
            value={traducao}
            onChange={e => { setTraducao(e.target.value); setShowVersaoMenu(false); }}
          >
            {traducoes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <button className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700" onClick={() => setShowVersaoMenu(false)}>Fechar</button>
        </div>
      )}
      {/* Removido campo de busca por palavra-chave e botão de tema amarelado */}
      <div className="flex gap-3 w-full max-w-md mb-2 px-2 overflow-x-auto mt-14">
        <select
          className={`flex-1 min-w-0 rounded-2xl border-2 text-xl font-semibold p-3 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2d2d35] border-[#23232b] text-white' : whiteMode ? 'bg-white border-gray-200 text-[#23232b]' : 'bg-white border-yellow-200 text-[#23232b] focus:ring-2 focus:ring-yellow-200'}`}
          value={livro}
          onChange={e => setLivro(e.target.value)}
        >
          {livros.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          className={`w-20 min-w-0 rounded-2xl border-2 text-xl font-semibold p-3 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2d2d35] border-[#23232b] text-white' : whiteMode ? 'bg-white border-gray-200 text-[#23232b]' : 'bg-white border-yellow-200 text-[#23232b] focus:ring-2 focus:ring-yellow-200'}`}
          value={capitulo}
          onChange={e => setCapitulo(Number(e.target.value))}
        >
          {capitulos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className={`w-full max-w-md border-b mb-6 ${darkMode ? 'border-[#23232b]' : whiteMode ? 'border-gray-200' : 'border-yellow-100'}`} />
      {(loading && lastVersiculos.length > 0) ? (
        <div className="flex flex-col gap-3 opacity-60 pointer-events-none select-none">
          {!buscando && (
            <h2 className={`text-2xl font-bold mb-4 ml-2 ${darkMode ? 'text-white' : whiteMode ? 'text-[#23232b]' : 'text-[#23232b]'}`}>{livro} {capitulo}</h2>
          )}
          {lastVersiculos.map((v: any, i: number) => (
              <div key={v.versiculo + '-' + i} className="flex items-start gap-2">
                <span className="text-[#a084e8] font-bold select-none" style={{minWidth: 18}}>{v.versiculo}</span>
                <span className="text-xl text-[#23232b] leading-relaxed">
                  {limparTexto(v.texto)}
                </span>
              </div>
            ))}
        </div>
      ) : null}
      {loading && lastVersiculos.length === 0 && <div className="text-center text-[#7c3aed]">Carregando...</div>}
      {erro && <div className="text-center text-red-500 font-semibold">{erro}</div>}
      {!loading && !erro && versiculos.length > 0 && (
        <div className="flex flex-col gap-3 px-6 sm:px-0">
          {!buscando && (
            <h2 className={`text-2xl font-bold mb-4 ml-2 ${darkMode ? 'text-white' : whiteMode ? 'text-[#23232b]' : 'text-[#23232b]'}`}>{livro} {capitulo}</h2>
          )}
          {versiculos.map((v: any, i: number) => {
            const id = `${livro}-${capitulo}-${v.versiculo}`;
            const cor = marcados[id];
            
            return (
              <div
                key={id}
                className={`flex items-start gap-2 rounded-xl p-3 mb-1 shadow-sm border transition select-none ${
                  cor 
                    ? `bg-[${cor}]/60 border-yellow-100` 
                    : darkMode 
                      ? 'bg-[#2d2d35] border-[#23232b]' 
                      : whiteMode 
                        ? 'bg-white border-gray-200' 
                        : 'bg-[#fffbea] border-yellow-100'
                }`}
                style={cor ? { backgroundColor: cor, opacity: 0.7 } : {}}
              >
                <span className="text-[#a084e8] font-bold select-none mt-1" style={{minWidth: 18}}>{v.versiculo}</span>
                <span className={`text-xl font-serif leading-relaxed ${darkMode ? 'text-white' : whiteMode ? 'text-[#23232b]' : temaLeitura ? 'text-[#23220a]' : 'text-[#23232b]'}`} style={{wordBreak: 'break-word'}}>
                  {limparTexto(v.texto)}
                </span>
                
                {/* Botão de marcação */}
                <button
                  onClick={() => setShowMarkButton(showMarkButton === id ? null : id)}
                  className={`ml-2 p-2 rounded-full transition-all ${
                    darkMode 
                      ? 'text-white hover:bg-white/10' 
                      : whiteMode
                        ? 'text-[#a084e8] hover:bg-gray-100'
                        : 'text-[#8b5cf6] hover:bg-yellow-100'
                  }`}
                  aria-label="Marcar versículo"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
                
                {/* Menu de marcação */}
                {showMarkButton === id && (
                  <>
                    {/* Overlay para fechar ao clicar fora */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowMarkButton(null)} />
                    {/* Menu fixo na parte de baixo */}
                    <div className="fixed left-0 right-0 bottom-20 z-50 flex justify-center items-end pointer-events-none">
                      <div className="w-full max-w-md px-2 pb-4">
                        <div className="flex gap-4 overflow-x-auto rounded-3xl py-4 px-3 shadow-xl pointer-events-auto bg-white">
                          {/* Botão de cor */}
                          <div className="flex items-center gap-2">
                            <button
                              className="w-12 h-12 rounded-full border-4 border-[#fef08a] bg-[#fef08a] flex items-center justify-center"
                              onClick={e => { e.stopPropagation(); marcarComCor(id, '#fef08a'); setShowMarkButton(null); }}
                              aria-label="Marcar amarelo"
                            />
                            <button
                              className="w-6 h-6 rounded-full border-2 border-[#bbf7d0] bg-[#bbf7d0] -ml-2"
                              onClick={e => { e.stopPropagation(); marcarComCor(id, '#bbf7d0'); setShowMarkButton(null); }}
                              aria-label="Marcar verde"
                            />
                            <button
                              className="w-6 h-6 rounded-full border-2 border-[#bae6fd] bg-[#bae6fd] -ml-2"
                              onClick={e => { e.stopPropagation(); marcarComCor(id, '#bae6fd'); setShowMarkButton(null); }}
                              aria-label="Marcar azul"
                            />
                            <button
                              className="w-6 h-6 rounded-full border-2 border-[#fbcfe8] bg-[#fbcfe8] -ml-2"
                              onClick={e => { e.stopPropagation(); marcarComCor(id, '#fbcfe8'); setShowMarkButton(null); }}
                              aria-label="Marcar rosa"
                            />
                          </div>
                          {/* Copiar */}
                          <button 
                            className="flex flex-col items-center justify-center min-w-[70px]" 
                            onClick={e => { 
                              e.stopPropagation(); 
                              copiarVersiculo(limparTexto(v.texto), livro, capitulo, v.versiculo);
                              setShowMarkButton(null);
                            }}
                          >
                            <svg width="28" height="28" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                            <span className="text-xs mt-1 text-[#23232b]">Copiar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Botão IA */}
                {iaPergunta && iaPergunta.id === id && (
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      className="bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-opacity opacity-80 hover:opacity-100"
                      onClick={() => perguntarIA(v.texto, 'O que este versículo significa?')}
                      aria-label="Perguntar à IA"
                    >
                      <svg width="24" height="24" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-6"/></svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Botões de navegação de capítulos */}
      {showCapituloBar && !loading && !erro && versiculos.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center items-center pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() => {
                if (capitulo > 1) {
                  setCapitulo(capitulo - 1);
                }
              }}
              disabled={capitulo <= 1}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                capitulo <= 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : darkMode 
                    ? 'text-white bg-white/10 hover:bg-white/20 active:scale-95'
                    : whiteMode
                      ? 'text-[#a084e8] bg-gray-100 hover:bg-gray-200 active:scale-95'
                      : 'text-[#8b5cf6] bg-yellow-100 hover:bg-yellow-200 active:scale-95'
              }`}
              aria-label="Capítulo anterior"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div className={`rounded-full px-10 py-5 shadow-lg ${
              darkMode 
                ? 'bg-[#2d2d35] text-white' 
                : whiteMode
                  ? 'bg-white text-gray-800'
                  : 'bg-white text-gray-800'
            }`}>
              <span className="text-xl font-bold whitespace-nowrap">
                {livro} {capitulo}
              </span>
            </div>
            
            <button
              onClick={() => {
                if (capitulo < (capitulosPorLivro[livro] || 1)) {
                  setCapitulo(capitulo + 1);
                }
              }}
              disabled={capitulo >= (capitulosPorLivro[livro] || 1)}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                capitulo >= (capitulosPorLivro[livro] || 1)
                  ? 'text-gray-400 cursor-not-allowed'
                  : darkMode 
                    ? 'text-white bg-white/10 hover:bg-white/20 active:scale-95'
                    : whiteMode
                      ? 'text-[#a084e8] bg-gray-100 hover:bg-gray-200 active:scale-95'
                      : 'text-[#8b5cf6] bg-yellow-100 hover:bg-yellow-200 active:scale-95'
              }`}
              aria-label="Próximo capítulo"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}