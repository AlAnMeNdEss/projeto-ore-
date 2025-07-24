import { useState, useEffect, useRef } from "react";
import { KEYWORDS, KeywordVerse } from "@/data/keywords";
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

  // Buscar versículos do capítulo usando API pública
  useEffect(() => {
    if (livroSelecionado && capituloSelecionado) {
      setCarregandoVersiculos(true);
      setErroVersiculos("");
      setVersiculos([]);
      const livroObj = livros.find(l => l.api === livroSelecionado);
      const nomeLivro = livroObj ? livroObj.nome.replace(/\s/g, "+") : livroSelecionado;
      // Usar API pública Bible-API
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
      className="min-h-screen w-screen flex flex-col items-center justify-start bg-[#f6eaff]"
      style={{ minHeight: '100vh', width: '100vw', padding: 0, margin: 0, boxSizing: 'border-box' }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-6 mb-4">
        <h1 className="text-3xl font-extrabold text-[#2d1457] text-center mb-4 tracking-tight">Bíblia Sagrada</h1>
      </div>
      <div className="w-full max-w-md mx-auto flex flex-row gap-3 mb-4">
        <select
          className="flex-1 h-14 px-6 rounded-2xl border border-[#e5e7eb] bg-[#fafbfc] text-[#2d1457] text-lg focus:ring-2 focus:ring-[#b2a4ff] outline-none shadow-sm"
          value={livroSelecionado || ''}
          onChange={e => {
            setLivroSelecionado(e.target.value);
            setCapituloSelecionado(null);
          }}
        >
          <option value="" disabled>Livro</option>
          {livros.filter(l => l.testamento === testamento).map(livro => (
            <option key={livro.api} value={livro.api}>{livro.nome}</option>
          ))}
        </select>
        <select
          className="flex-1 h-14 px-6 rounded-2xl border border-[#e5e7eb] bg-[#fafbfc] text-[#2d1457] text-lg focus:ring-2 focus:ring-[#b2a4ff] outline-none shadow-sm"
          value={capituloSelecionado || ''}
          onChange={e => setCapituloSelecionado(Number(e.target.value))}
          disabled={!livroSelecionado}
        >
          <option value="" disabled>Capítulo</option>
          {livroSelecionado &&
            Array.from({ length: livros.find(l => l.api === livroSelecionado)?.capitulos || 1 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
        </select>
      </div>
      {/* Linha divisória entre selects e versículos */}
      <div className="w-full max-w-md mx-auto border-b-2 border-[#ececec] mb-6"></div>
      {/* Removido os botões de Antigo e Novo Testamento */}
      {/* Campo de busca removido */}
      {/* Versículos do capítulo */}
      {capituloSelecionado && (
        <div className="w-full max-w-md mx-auto mt-6 relative">
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
          {/* Título do livro e capítulo */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2d1457] mb-2">{livros.find(l => l.api === livroSelecionado)?.nome} {capituloSelecionado}</h2>
          </div>
          {/* Lista de versículos */}
          <div className="flex flex-col gap-6">
            {carregandoVersiculos ? (
              <div className="text-center text-[#8b5cf6] text-lg">Carregando versículos...</div>
            ) : erroVersiculos ? (
              <div className="text-center text-red-400">{erroVersiculos}</div>
            ) : (
              versiculos.map((v, i) => {
                return (
                  <div key={i} className="flex items-start gap-2">
                    <sup className="text-[#a084e8] font-bold text-base mt-1 select-none">{v.verse}</sup>
                    <span className="text-lg text-[#181824] leading-relaxed break-words">{v.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
} 