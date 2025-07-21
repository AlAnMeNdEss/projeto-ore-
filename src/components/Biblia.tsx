import { useState, useEffect, useRef } from "react";
import { KEYWORDS, KeywordVerse } from "@/data/keywords";
import bgImage from '@/assets/spiritual-background.jpg';
import { FaWhatsapp } from 'react-icons/fa';

const livros = [
  { nome: "Gênesis", api: "gn", testamento: "antigo", capitulos: 50 },
  { nome: "Êxodo", api: "ex", testamento: "antigo", capitulos: 40 },
  { nome: "Levítico", api: "lv", testamento: "antigo", capitulos: 27 },
  { nome: "Números", api: "nm", testamento: "antigo", capitulos: 36 },
  { nome: "Deuteronômio", api: "dt", testamento: "antigo", capitulos: 34 },
  { nome: "Josué", api: "js", testamento: "antigo", capitulos: 24 },
  { nome: "Juízes", api: "jz", testamento: "antigo", capitulos: 21 },
  { nome: "Rute", api: "rt", testamento: "antigo", capitulos: 4 },
  { nome: "1 Samuel", api: "1sm", testamento: "antigo", capitulos: 31 },
  { nome: "2 Samuel", api: "2sm", testamento: "antigo", capitulos: 24 },
  { nome: "1 Reis", api: "1rs", testamento: "antigo", capitulos: 22 },
  { nome: "2 Reis", api: "2rs", testamento: "antigo", capitulos: 25 },
  { nome: "1 Crônicas", api: "1cr", testamento: "antigo", capitulos: 29 },
  { nome: "2 Crônicas", api: "2cr", testamento: "antigo", capitulos: 36 },
  { nome: "Esdras", api: "ed", testamento: "antigo", capitulos: 10 },
  { nome: "Neemias", api: "ne", testamento: "antigo", capitulos: 13 },
  { nome: "Ester", api: "et", testamento: "antigo", capitulos: 10 },
  { nome: "Jó", api: "job", testamento: "antigo", capitulos: 42 },
  { nome: "Salmos", api: "sl", testamento: "antigo", capitulos: 150 },
  { nome: "Provérbios", api: "pv", testamento: "antigo", capitulos: 31 },
  { nome: "Eclesiastes", api: "ec", testamento: "antigo", capitulos: 12 },
  { nome: "Cânticos", api: "ct", testamento: "antigo", capitulos: 8 },
  { nome: "Isaías", api: "is", testamento: "antigo", capitulos: 66 },
  { nome: "Jeremias", api: "jr", testamento: "antigo", capitulos: 52 },
  { nome: "Lamentações", api: "lm", testamento: "antigo", capitulos: 5 },
  { nome: "Ezequiel", api: "ez", testamento: "antigo", capitulos: 48 },
  { nome: "Daniel", api: "dn", testamento: "antigo", capitulos: 12 },
  { nome: "Oseias", api: "os", testamento: "antigo", capitulos: 14 },
  { nome: "Joel", api: "jl", testamento: "antigo", capitulos: 3 },
  { nome: "Amós", api: "am", testamento: "antigo", capitulos: 9 },
  { nome: "Obadias", api: "ob", testamento: "antigo", capitulos: 1 },
  { nome: "Jonas", api: "jn", testamento: "antigo", capitulos: 4 },
  { nome: "Miquéias", api: "mq", testamento: "antigo", capitulos: 7 },
  { nome: "Naum", api: "na", testamento: "antigo", capitulos: 3 },
  { nome: "Habacuque", api: "hc", testamento: "antigo", capitulos: 3 },
  { nome: "Sofonias", api: "sf", testamento: "antigo", capitulos: 3 },
  { nome: "Ageu", api: "ag", testamento: "antigo", capitulos: 2 },
  { nome: "Zacarias", api: "zc", testamento: "antigo", capitulos: 14 },
  { nome: "Malaquias", api: "ml", testamento: "antigo", capitulos: 4 },
  { nome: "Mateus", api: "mt", testamento: "novo", capitulos: 28 },
  { nome: "Marcos", api: "mc", testamento: "novo", capitulos: 16 },
  { nome: "Lucas", api: "lc", testamento: "novo", capitulos: 24 },
  { nome: "João", api: "jo", testamento: "novo", capitulos: 21 },
  { nome: "Atos", api: "at", testamento: "novo", capitulos: 28 },
  { nome: "Romanos", api: "rm", testamento: "novo", capitulos: 16 },
  { nome: "1 Coríntios", api: "1co", testamento: "novo", capitulos: 16 },
  { nome: "2 Coríntios", api: "2co", testamento: "novo", capitulos: 13 },
  { nome: "Gálatas", api: "gl", testamento: "novo", capitulos: 6 },
  { nome: "Efésios", api: "ef", testamento: "novo", capitulos: 6 },
  { nome: "Filipenses", api: "fp", testamento: "novo", capitulos: 4 },
  { nome: "Colossenses", api: "cl", testamento: "novo", capitulos: 4 },
  { nome: "1 Tessalonicenses", api: "1ts", testamento: "novo", capitulos: 5 },
  { nome: "2 Tessalonicenses", api: "2ts", testamento: "novo", capitulos: 3 },
  { nome: "1 Timóteo", api: "1tm", testamento: "novo", capitulos: 6 },
  { nome: "2 Timóteo", api: "2tm", testamento: "novo", capitulos: 4 },
  { nome: "Tito", api: "tt", testamento: "novo", capitulos: 3 },
  { nome: "Filemom", api: "fm", testamento: "novo", capitulos: 1 },
  { nome: "Hebreus", api: "hb", testamento: "novo", capitulos: 13 },
  { nome: "Tiago", api: "tg", testamento: "novo", capitulos: 5 },
  { nome: "1 Pedro", api: "1pe", testamento: "novo", capitulos: 5 },
  { nome: "2 Pedro", api: "2pe", testamento: "novo", capitulos: 3 },
  { nome: "1 João", api: "1jo", testamento: "novo", capitulos: 5 },
  { nome: "2 João", api: "2jo", testamento: "novo", capitulos: 1 },
  { nome: "3 João", api: "3jo", testamento: "novo", capitulos: 1 },
  { nome: "Judas", api: "jd", testamento: "novo", capitulos: 1 },
  { nome: "Apocalipse", api: "ap", testamento: "novo", capitulos: 22 }
];

function sugerirPalavrasChave(input: string): string[] {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return KEYWORDS.filter(k => k.palavra.includes(lower)).map(k => k.palavra);
}

function buscarPorPalavraChave(palavra: string): KeywordVerse | undefined {
  return KEYWORDS.find(k => k.palavra.toLowerCase() === palavra.toLowerCase());
}

export default function Biblia() {
  const [testamento, setTestamento] = useState<'antigo' | 'novo'>('antigo');
  const [busca, setBusca] = useState("");
  const [modoBusca, setModoBusca] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [resultadosPalavraChave, setResultadosPalavraChave] = useState<KeywordVerse | null>(null);
  const [livroSelecionado, setLivroSelecionado] = useState<string | null>(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState<number | null>(null);
  const [versiculos, setVersiculos] = useState<any[]>([]);
  const [carregandoVersiculos, setCarregandoVersiculos] = useState(false);
  const [erroVersiculos, setErroVersiculos] = useState("");
  // Remover estados e funções do modo pergaminho
  // const [modoPergaminho, setModoPergaminho] = useState(false);
  // const [pergaminhoCapitulos, setPergaminhoCapitulos] = useState<any[]>([]);
  // const [carregandoPergaminho, setCarregandoPergaminho] = useState(false);
  // async function carregarPergaminho(livroApi: string) { ... }

  // Função para buscar um devocional temático
  function buscarDevocionalTematico() {
    setCarregandoDevocional(true);
    const tema = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    const vers = tema.versiculos[Math.floor(Math.random() * tema.versiculos.length)];
    setTimeout(() => {
      setDevocional({ reference: vers.referencia, text: vers.texto, tema: tema.palavra });
      setCarregandoDevocional(false);
    }, 400); // pequena animação de loading
  }

  // Ajustar o tipo do devocional para incluir tema
  const [devocional, setDevocional] = useState<{reference: string, text: string, tema: string} | null>(null);
  const [carregandoDevocional, setCarregandoDevocional] = useState(false);

  // Marca-texto: estado para versículos marcados
  const [marcados, setMarcados] = useState<{ [key: string]: string }>({}); // key: 'livro:capitulo:verso', value: cor
  const [menuCor, setMenuCor] = useState<{ key: string, x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cores = [
    { nome: 'Amarelo', cor: 'rgba(254, 240, 138, 0.6)' }, // amarelo translúcido
    { nome: 'Verde', cor: 'rgba(187, 247, 208, 0.6)' },   // verde translúcido
    { nome: 'Rosa', cor: 'rgba(251, 207, 232, 0.6)' },    // rosa translúcido
    { nome: 'Azul', cor: 'rgba(186, 230, 253, 0.6)' },    // azul translúcido
    { nome: 'Laranja', cor: 'rgba(253, 186, 116, 0.6)' }, // laranja translúcido
  ];

  // Fecha menu de cor ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuCor(null);
      }
    }
    if (menuCor) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuCor]);

  // Função utilitária para detectar long press (mouse e touch)
  function getLongPressHandlers(callback: (e: React.MouseEvent | React.TouchEvent) => void, ms = 400) {
    let timer: NodeJS.Timeout | null = null;
    let moved = false;
    return {
      onMouseDown: (e: React.MouseEvent) => {
        moved = false;
        timer = setTimeout(() => callback(e), ms);
      },
      onMouseUp: () => {
        if (timer) clearTimeout(timer);
      },
      onMouseLeave: () => {
        if (timer) clearTimeout(timer);
      },
      onTouchStart: (e: React.TouchEvent) => {
        moved = false;
        timer = setTimeout(() => callback(e), ms);
      },
      onTouchEnd: () => {
        if (timer) clearTimeout(timer);
      },
      onTouchMove: () => {
        moved = true;
        if (timer) clearTimeout(timer);
      }
    };
  }

  useEffect(() => {
    buscarDevocionalTematico();
  }, []);

  useEffect(() => {
    if (!busca.trim()) {
      setModoBusca(false);
      setSugestoes([]);
      setResultadosPalavraChave(null);
      return;
    }
    const sugest = sugerirPalavrasChave(busca);
    setSugestoes(sugest);
    const resultado = buscarPorPalavraChave(busca);
    if (resultado) {
      setResultadosPalavraChave(resultado);
      setModoBusca(true);
    } else {
      setResultadosPalavraChave(null);
      setModoBusca(true);
    }
  }, [busca]);

  useEffect(() => {
    if (livroSelecionado && capituloSelecionado) {
      setCarregandoVersiculos(true);
      setErroVersiculos("");
      setVersiculos([]);
      const livroObj = livros.find(l => l.api === livroSelecionado);
      const nomeLivro = livroObj ? livroObj.nome.replace(/\s/g, "+") : livroSelecionado;
      fetch(`https://bible-api.com/${nomeLivro}+${capituloSelecionado}?translation=almeida`)
        .then(res => res.json())
        .then(data => {
          if (data.verses) {
            setVersiculos(data.verses);
          } else {
            setErroVersiculos("Não foi possível carregar os versículos.");
          }
          setCarregandoVersiculos(false);
        })
        .catch(() => {
          setErroVersiculos("Erro ao buscar versículos na API.");
          setCarregandoVersiculos(false);
        });
    }
  }, [livroSelecionado, capituloSelecionado]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para escurecer o fundo e dar contraste */}
      <div className="absolute inset-0 bg-[#2d1457]/70 z-0" />
      <div className="relative z-20 w-full">
        {/* Logo igual tela de pedidos */}
        <div className="flex flex-col items-center justify-center mb-2 mt-6 animate-fade-in">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#b2a4ff] via-[#e0c3fc] to-[#8ec5fc] mb-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C16 17 16 14 16 12M16 20C16 18 14 16 13 15M16 20C16 18 18 16 19 15M13 15C12.5 14.5 12 13.5 12 13C12 12 13 11 14 12C15 13 15 14 15 15M19 15C19.5 14.5 20 13.5 20 13C20 12 19 11 18 12C17 13 17 14 17 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[#b2a4ff] tracking-wide text-center">Ore+</h1>
        </div>
        {/* Cabeçalho removido conforme solicitado */}
        {/* Abas */}
        <div className="flex w-full max-w-md gap-2 overflow-x-auto scrollbar-hide rounded-xl bg-white/5 p-1 shadow-inner mb-4 animate-fade-in">
          <button
            className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${testamento === 'antigo' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
            onClick={() => {
              setTestamento('antigo');
              setLivroSelecionado(null);
              setCapituloSelecionado(null);
            }}
          >
            ANTIGO TESTAMEN...
          </button>
          <button
            className={`flex-1 min-w-[140px] px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${testamento === 'novo' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white scale-105 shadow-lg' : 'bg-transparent text-gray-300 hover:bg-white/10 hover:scale-105'}`}
            onClick={() => {
              setTestamento('novo');
              setLivroSelecionado(null);
              setCapituloSelecionado(null);
            }}
          >
            NOVO TESTAMENTO
          </button>
        </div>
        {/* Campo de busca */}
        <div className="w-full max-w-md mx-auto px-2 mb-4 animate-fade-in">
          <input
            type="text"
            placeholder="Pesquisar na Bíblia"
            className="w-full p-3 rounded-xl border border-[#8b5cf6] bg-white text-[#2d1457] text-base focus:ring-2 focus:ring-[#b2a4ff] outline-none placeholder:text-[#b2a4ff]/60"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {/* Sugestões de autocomplete */}
          {sugestoes.length > 0 && busca && (
            <div className="mt-2 bg-[#2d1457] rounded shadow p-2 text-[#b2a4ff] border border-[#8b5cf6]/30 animate-fade-in">
              <div className="font-semibold text-xs mb-1 text-[#8b5cf6]">Sugestões:</div>
              <div className="flex flex-wrap gap-2">
                {sugestoes.map(s => (
                  <button
                    key={s}
                    className="px-2 py-1 rounded bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/40 text-xs font-bold transition-all duration-200 hover:scale-105"
                    onClick={() => setBusca(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Lista de livros ou capítulos */}
        {!livroSelecionado ? (
          <div className="w-full max-w-md mx-auto flex flex-col gap-3 px-2 pb-28 animate-fade-slide-in">
            {livros.filter(l => l.testamento === testamento).map(livro => (
              <button
                key={livro.api}
                className="w-full py-4 rounded-2xl border border-[#8b5cf6] bg-[#2d1457] text-[#b2a4ff] font-bold text-lg shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#8b5cf6]/10"
                onClick={() => setLivroSelecionado(livro.api)}
              >
                {livro.nome}
              </button>
            ))}
          </div>
        ) : !capituloSelecionado ? (
          <div className="w-full max-w-md mx-auto flex flex-wrap gap-2 px-2 justify-center pb-28 animate-fade-slide-in">
            {Array.from({ length: livros.find(l => l.api === livroSelecionado)?.capitulos || 1 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className="w-16 h-12 rounded-xl border border-[#8b5cf6] bg-[#2d1457] text-[#b2a4ff] font-bold text-lg shadow-sm transition-all duration-200 hover:scale-110 hover:bg-[#8b5cf6]/10"
                onClick={() => setCapituloSelecionado(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="w-full mt-2 py-2 rounded-xl border border-[#8b5cf6] bg-[#181824] text-[#b2a4ff] font-bold text-base transition-all duration-200 hover:scale-105"
              onClick={() => setLivroSelecionado(null)}
            >
              Voltar aos livros
            </button>
          </div>
        ) : null}
        {/* Resultados de busca por palavra-chave */}
        {modoBusca && (
          <div className="w-full max-w-2xl mx-auto mt-6">
            <div className="rounded-2xl border border-[#a78bfa]/30 bg-[#2d1457]/80 shadow-xl backdrop-blur-xl p-6 overflow-hidden">
              <div className="pb-2 flex flex-row items-center gap-3 border-b border-[#a78bfa]/20 px-2 pt-2">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow-md">
                  📖
                </span>
                <span className="font-semibold text-[#b2a4ff] text-lg mr-2">Resultados da Palavra-chave</span>
              </div>
              <div className="pt-4 pb-2 px-2">
                {resultadosPalavraChave ? (
                  resultadosPalavraChave.versiculos.map((v, i) => (
                    <div key={i} className="mb-4">
                      <div className="text-[#b2a4ff] font-semibold text-base mb-1">{v.referencia}</div>
                      <div className="text-white/90 drop-shadow-lg text-lg leading-relaxed">{v.texto}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-red-400">Nenhuma palavra-chave encontrada. Veja sugestões acima.</div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Versículos do capítulo */}
        {capituloSelecionado && !modoBusca && (
          <div className="w-full max-w-2xl mx-auto mt-6 relative">
            {/* Menu de seleção de cor */}
            {menuCor && (
              <div
                ref={menuRef}
                className="absolute z-[9999] flex gap-2 p-2 bg-white rounded-xl shadow-lg border border-[#b2a4ff]/40 animate-fade-in"
                style={{ left: menuCor.x, top: menuCor.y }}
              >
                {cores.map(c => (
                  <button
                    key={c.cor}
                    className="w-8 h-8 rounded-full border-2 border-[#b2a4ff]/30 hover:scale-110 transition-all"
                    style={{ background: c.cor }}
                    onClick={() => {
                      setMarcados(m => ({ ...m, [menuCor.key]: c.cor }));
                      setMenuCor(null);
                    }}
                  />
                ))}
                <button
                  className="w-8 h-8 rounded-full border-2 border-[#b2a4ff]/30 flex items-center justify-center text-[#b2a4ff] bg-white hover:scale-110 transition-all"
                  onClick={() => {
                    setMarcados(m => {
                      const novo = { ...m };
                      delete novo[menuCor.key];
                      return novo;
                    });
                    setMenuCor(null);
                  }}
                  title="Remover marcação"
                >
                  ×
                </button>
              </div>
            )}
            <div className="rounded-2xl border border-[#a78bfa]/30 bg-[#2d1457]/80 shadow-xl backdrop-blur-xl p-6 overflow-hidden">
              <div className="pb-2 flex flex-row items-center gap-3 border-b border-[#a78bfa]/20 px-2 pt-2">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow-md">
                  📖
                </span>
                <span className="font-semibold text-[#b2a4ff] text-lg mr-2">{livros.find(l => l.api === livroSelecionado)?.nome} {capituloSelecionado}</span>
              </div>
              <div className="pt-4 pb-2 px-2">
                {carregandoVersiculos ? (
                  <div className="text-center text-white">Carregando versículos...</div>
                ) : erroVersiculos ? (
                  <div className="text-center text-red-400">{erroVersiculos}</div>
                ) : (
                  versiculos.map((v, i) => {
                    const key = `${livroSelecionado}:${capituloSelecionado}:${v.verse}`;
                    const cor = marcados[key];
                    let longPressTimer: NodeJS.Timeout | null = null;
                    let pressed = false;
                    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
                      let rect;
                      if ('touches' in e && e.touches.length > 0) {
                        rect = (e.target as HTMLElement).getBoundingClientRect();
                      } else {
                        rect = (e.target as HTMLElement).getBoundingClientRect();
                      }
                      const x = Math.min(rect.left + 40, window.innerWidth - 180);
                      const y = Math.max(rect.top - 10, 20);
                      setMenuCor({ key, x, y });
                    };
                    return (
                      <div
                        key={i}
                        className={`rounded-xl border border-[#8b5cf6]/20 p-4 text-white/90 shadow-sm mb-3 relative select-none transition-transform duration-150 flex items-center`}
                        onMouseDown={e => {
                          pressed = true;
                          e.preventDefault();
                          longPressTimer = setTimeout(() => { handleLongPress(e); pressed = false; }, 350);
                        }}
                        onMouseUp={() => {
                          pressed = false;
                          if (longPressTimer) clearTimeout(longPressTimer);
                        }}
                        onMouseLeave={() => {
                          pressed = false;
                          if (longPressTimer) clearTimeout(longPressTimer);
                        }}
                        onTouchStart={e => {
                          pressed = true;
                          e.preventDefault();
                          longPressTimer = setTimeout(() => { handleLongPress(e); pressed = false; }, 350);
                        }}
                        onTouchEnd={() => {
                          pressed = false;
                          if (longPressTimer) clearTimeout(longPressTimer);
                        }}
                        onTouchMove={() => {
                          pressed = false;
                          if (longPressTimer) clearTimeout(longPressTimer);
                        }}
                        onContextMenu={e => {
                          e.preventDefault();
                          handleLongPress(e);
                        }}
                        style={{
                          background: cor ? cor : '#1a093e99',
                          color: '#fff',
                          cursor: 'pointer',
                          transition: 'background 0.2s, transform 0.15s',
                          transform: pressed ? 'scale(0.97)' : 'scale(1)'
                        }}
                      >
                        <span className="font-bold text-[#b2a4ff] mr-2">{v.verse}</span>
                        <span className="flex-1">{v.text}</span>
                        <button
                          className="ml-2 p-2 rounded-full bg-[#25d366]/20 hover:bg-[#25d366]/40 transition-colors"
                          title="Compartilhar no WhatsApp"
                          onClick={() => {
                            const livroNome = livros.find(l => l.api === livroSelecionado)?.nome || '';
                            const referencia = `${livroNome} ${capituloSelecionado}:${v.verse}`;
                            const texto = `${referencia} — ${v.text}`;
                            const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <FaWhatsapp className="text-[#25d366] w-5 h-5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Setas de navegação entre capítulos na leitura de capítulo único */}
              {(() => {
                const livroObj = livros.find(l => l.api === livroSelecionado);
                if (!livroObj) return null;
                const idxLivro = livros.findIndex(l => l.api === livroSelecionado);
                const ehPrimeiroCapitulo = capituloSelecionado === 1;
                const ehUltimoCapitulo = capituloSelecionado === livroObj.capitulos;
                const existeProximoLivro = idxLivro < livros.length - 1;
                const existeLivroAnterior = idxLivro > 0;
                return (
                  <div className="flex justify-between items-center mt-8 px-4">
                    {/* Seta para capítulo anterior */}
                    {(!ehPrimeiroCapitulo || existeLivroAnterior) ? (
                      <button
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#8b5cf6]/80 text-white shadow-lg hover:scale-110 transition-all duration-200"
                        onClick={() => {
                          if (!ehPrimeiroCapitulo) {
                            setCapituloSelecionado(capituloSelecionado - 1);
                          } else if (existeLivroAnterior) {
                            const livroAnterior = livros[idxLivro - 1];
                            setLivroSelecionado(livroAnterior.api);
                            setCapituloSelecionado(livroAnterior.capitulos);
                          }
                        }}
                        aria-label="Capítulo anterior"
                      >
                        {/* Ícone SVG seta esquerda */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                    ) : <div className="w-14" />} {/* Espaço para alinhar */}
                    {/* Seta para próximo capítulo */}
                    {(!ehUltimoCapitulo || existeProximoLivro) ? (
                      <button
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#8b5cf6]/80 text-white shadow-lg hover:scale-110 transition-all duration-200"
                        onClick={() => {
                          if (!ehUltimoCapitulo) {
                            setCapituloSelecionado(capituloSelecionado + 1);
                          } else if (existeProximoLivro) {
                            const proximoLivro = livros[idxLivro + 1];
                            setLivroSelecionado(proximoLivro.api);
                            setCapituloSelecionado(1);
                          }
                        }}
                        aria-label="Próximo capítulo"
                      >
                        {/* Ícone SVG seta direita */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    ) : <div className="w-14" />} {/* Espaço para alinhar */}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 