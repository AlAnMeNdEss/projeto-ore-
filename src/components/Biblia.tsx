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
  const [livro, setLivro] = useState('Salmos');
  const [capitulo, setCapitulo] = useState(23);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [pending, setPending] = useState(false);
  const [lastVersiculos, setLastVersiculos] = useState<any[]>([]);

  // Versículos marcados com cor (favoritos) salvos no localStorage
  const [marcados, setMarcados] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('versiculosMarcadosCor') || '{}');
    } catch {
      return {};
    }
  });
  const [menuCor, setMenuCor] = useState<{id: string, top: number, left: number} | null>(null);
  const [iaPergunta, setIaPergunta] = useState<{id: string, pergunta: string, resposta: string, loading: boolean} | null>(null);

  function marcarComCor(versiculoId: string, cor: string) {
    setMarcados(prev => {
      const novo = { ...prev, [versiculoId]: cor };
      localStorage.setItem('versiculosMarcadosCor', JSON.stringify(novo));
      return novo;
    });
    setMenuCor(null);
  }

  function handleHold(e: React.MouseEvent | React.TouchEvent, id: string) {
    e.preventDefault();
    let top = 0, left = 0;
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      top = touch.clientY;
      left = touch.clientX;
    } else if ('clientY' in e) {
      top = e.clientY;
      left = e.clientX;
    }
    setMenuCor({ id, top, left });
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
          const search = encodeURIComponent(busca.trim());
          url = `https://api.biblesupersearch.com/api?bible=${traducao}&search=${search}`;
        } else {
          setBuscando(false);
          const ref = encodeURIComponent(`${livro} ${capitulo}`);
          url = `https://api.biblesupersearch.com/api?bible=${traducao}&reference=${ref}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (cancelado) return;
        if (data.errors && data.errors.length > 0) {
          setErro(data.errors.join(' '));
          setVersiculos([]);
        } else {
          if (busca.trim() !== '') {
            let encontrados: any[] = [];
            if (Array.isArray(data.results)) {
              data.results.forEach((passagem: any) => {
                if (passagem.verses && passagem.verses[traducao]) {
                  Object.values(passagem.verses[traducao]).forEach((cap: any) => {
                    Object.values(cap).forEach((v: any) => encontrados.push(v));
                  });
                }
              });
            }
            setVersiculos(encontrados);
            setLastVersiculos(encontrados);
          } else {
            const results = data.results && data.results.length > 0 ? data.results[0] : null;
            if (results && results.verses && results.verses[traducao]) {
              const cap = results.verses[traducao][capitulo];
              if (cap) {
                setVersiculos(Object.values(cap));
                setLastVersiculos(Object.values(cap));
              } else {
                setVersiculos([]);
                setLastVersiculos([]);
              }
            } else {
              setVersiculos([]);
              setLastVersiculos([]);
            }
          }
        }
      } catch (e) {
        if (!cancelado) setErro('Erro ao buscar versículos.');
      }
      if (!cancelado) setLoading(false);
      if (!cancelado) setPending(false);
      clearTimeout(loadingTimeout);
    }
    fetchVersiculos();
    return () => { cancelado = true; clearTimeout(loadingTimeout); };
  }, [livro, capitulo, traducao, busca]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-2 pt-6 bg-[#18181b] overflow-y-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#23232b] text-center mb-6">Bíblia Sagrada</h1>
      {/* Removido campo de busca por palavra-chave e botão de tema amarelado */}
      <div className="flex gap-2 w-full max-w-md mb-6 px-2 overflow-x-auto">
        <select
          className="w-40 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={traducao}
          onChange={e => setTraducao(e.target.value)}
        >
          {traducoes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          className="flex-1 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={livro}
          onChange={e => setLivro(e.target.value)}
        >
          {livros.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          className="w-20 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={capitulo}
          onChange={e => setCapitulo(Number(e.target.value))}
        >
          {capitulos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className={`w-full max-w-md rounded-xl p-4 min-h-[200px] border border-purple-200 rounded-2xl ${temaLeitura ? 'bg-yellow-50' : 'bg-white/80'}`}>
        {(loading && lastVersiculos.length > 0) ? (
          <div className="flex flex-col gap-3 opacity-60 pointer-events-none select-none">
            {!buscando && (
              <h2 className="text-xl font-bold text-[#23232b] mb-2">{livro} {capitulo}</h2>
            )}
            {lastVersiculos.map((v: any, i: number) => (
              <div key={v.verse + '-' + i} className="flex items-start gap-2">
                <span className="text-[#a084e8] font-bold select-none" style={{minWidth: 18}}>{v.verse}</span>
                <span className="text-lg text-[#23232b] leading-relaxed">
                  {limparTexto(v.text)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {loading && lastVersiculos.length === 0 && <div className="text-center text-[#7c3aed]">Carregando...</div>}
        {erro && <div className="text-center text-red-500 font-semibold">{erro}</div>}
        {!loading && !erro && versiculos.length > 0 && (
          <div className="flex flex-col gap-3">
            {!buscando && (
              <h2 className="text-xl font-bold text-[#23232b] mb-2">{livro} {capitulo}</h2>
            )}
            {versiculos.map((v: any, i: number) => {
              const id = `${livro}-${capitulo}-${v.verse}`;
              const cor = marcados[id];
              let holdTimeout: any = null;
              function onMouseDown(e: React.MouseEvent) {
                holdTimeout = setTimeout(() => handleHold(e, id), 350);
              }
              function onMouseUp() { clearTimeout(holdTimeout); }
              function onMouseLeave() { clearTimeout(holdTimeout); }
              function onTouchStart(e: React.TouchEvent) {
                holdTimeout = setTimeout(() => handleHold(e, id), 350);
              }
              function onTouchEnd() { clearTimeout(holdTimeout); }
              return (
                <div
                  key={id}
                  className={`flex items-start gap-2 rounded-lg transition select-none ${cor ? `bg-[${cor}]/60` : ''}`}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  style={cor ? { backgroundColor: cor, opacity: 0.7 } : {}}
                >
                  <span className="text-[#a084e8] font-bold select-none mt-1" style={{minWidth: 18}}>{v.verse}</span>
                  <span className={`text-lg font-serif leading-relaxed ${temaLeitura ? 'text-[#23220a]' : 'text-[#23232b]'}`} style={{wordBreak: 'break-word'}}>
                    {limparTexto(v.text)}
                  </span>
                  {/* Menu de seleção de cor e botão IA */}
                  {menuCor && menuCor.id === id && (
                    <div
                      className="absolute z-30 flex gap-2 p-2 rounded-xl shadow-lg bg-white border border-[#ececec]"
                      style={{ top: menuCor.top - 60, left: menuCor.left - 80 }}
                    >
                      {['#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8'].map(corSel => (
                        <button
                          key={corSel}
                          className="w-8 h-8 rounded-full border-2 border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
                          style={{ backgroundColor: corSel }}
                          onClick={e => { e.stopPropagation(); marcarComCor(id, corSel); }}
                          aria-label={`Marcar com cor ${corSel}`}
                        />
                      ))}
                      <button
                        className="w-8 h-8 rounded-full border-2 border-[#e5e7eb] flex items-center justify-center bg-white"
                        onClick={e => { e.stopPropagation(); marcarComCor(id, ''); }}
                        aria-label="Remover marcação"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a084e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                      {/* Botão IA */}
                      <button
                        className="w-8 h-8 rounded-full border-2 border-[#e5e7eb] flex items-center justify-center bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#e9d8fd] ml-2"
                        onClick={e => { e.stopPropagation(); setIaPergunta({ id, pergunta: '', resposta: '', loading: false }); }}
                        aria-label="Perguntar IA sobre o versículo"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!loading && !erro && versiculos.length === 0 && (
          <div className="text-center text-[#23232b]">Nenhum versículo encontrado.</div>
        )}
        {/* Espaço extra para não cobrir o último versículo com a barra de navegação */}
        <div style={{ marginBottom: 100 }} />
      </div>
      {/* Barra de capítulos fixa no rodapé, some ao rolar para baixo */}
      <div
        className={`w-full flex justify-center items-center transition-transform duration-300 ${showCapituloBar ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        style={{ position: 'fixed', left: 0, right: 0, bottom: 64, zIndex: 30 }}
      >
        <div className="flex items-center bg-white/80 rounded-full px-4 py-1 gap-2 shadow-lg border border-[#ececec] mb-2" style={{ minWidth: 220, height: 48 }}>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#23232b] text-xl mr-2 disabled:opacity-40 border border-[#ececec]"
            onClick={() => setCapitulo(c => Math.max(1, c - 1))}
            disabled={capitulo === 1}
            aria-label="Capítulo anterior"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="flex-1 text-center text-[#23232b] text-lg font-bold select-none" style={{ minWidth: 90 }}>{livro} {capitulo}</span>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#23232b] text-xl ml-2 disabled:opacity-40 border border-[#ececec]"
            onClick={() => setCapitulo(c => Math.min(capitulos.length, c + 1))}
            disabled={capitulo === capitulos.length}
            aria-label="Próximo capítulo"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      {/* Fechar menu de cor ao clicar fora */}
      {menuCor && <div className="fixed inset-0 z-20" onClick={() => setMenuCor(null)} />}
      {/* Modal de pergunta para IA */}
      {iaPergunta && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2 text-[#7c3aed]">Pergunte sobre o versículo</h3>
            <input
              className="w-full border border-[#ececec] rounded-lg p-2 mb-2 text-base"
              placeholder="Digite sua pergunta..."
              value={iaPergunta.pergunta}
              onChange={e => setIaPergunta(prev => prev && { ...prev, pergunta: e.target.value })}
              disabled={iaPergunta.loading}
            />
            <button
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl px-4 py-2 mb-2"
              onClick={() => perguntarIA(iaPergunta.id, iaPergunta.pergunta)}
              disabled={iaPergunta.loading || !iaPergunta.pergunta.trim()}
            >
              {iaPergunta.loading ? 'Perguntando...' : 'Perguntar'}
            </button>
            {iaPergunta.resposta && (
              <div className="w-full bg-[#f6eaff] rounded-lg p-3 text-[#23232b] text-base mt-2">{iaPergunta.resposta}</div>
            )}
            <button className="mt-4 text-[#a084e8] underline" onClick={() => setIaPergunta(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
} 